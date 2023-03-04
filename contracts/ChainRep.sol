//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { IChainRep } from "./IChainRep.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { EnumerableSet } from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract ChainRep is IChainRep, Context {

    using EnumerableSet for EnumerableSet.UintSet;

    uint256 private _certificateId;
    uint256 private _reportId;

    mapping(uint256 => mapping(address => bool)) private _certificateIssued;
    mapping(uint256 => Certificate) private _certificateMap;
    mapping(uint256 => Report) private _reportMap;
    mapping(address => EnumerableSet.UintSet) private _contractReports;

    constructor() { }

    modifier _isAuthority(uint256 certificateId) {
        require(_certificateMap[certificateId].authority == _msgSender(), "not authority");
        _;
    }

    modifier _isReviewer(uint256 reportId) {
        require(_reportMap[reportId].reviewer == _msgSender(), "not reviewer");
        _;
    }

    function numCertificates () external view returns(uint256) {
        return _certificateId;
    }

    function issueCertificate (uint256 certificateId, address reviewer) external _isAuthority(certificateId) {
        require(!_certificateIssued[certificateId][reviewer], "already issued");
        _certificateIssued[certificateId][reviewer] = true;
        emit IssueCertificate(certificateId, _msgSender(), reviewer);
    }

    function revokeCertificate (uint256 certificateId, address reviewer) external _isAuthority(certificateId) {
        require(_certificateIssued[certificateId][reviewer], "not issued");
        delete _certificateIssued[certificateId][reviewer];
        emit RevokeCertificate(certificateId, _msgSender(), reviewer);
    }

    function createCertificate (string calldata name) external returns(uint256) {
        uint256 id = _certificateId++;
        _certificateMap[id].name = name;
        _certificateMap[id].authority = _msgSender();
        emit CreateCertificate(id, _msgSender(), name);
        return id;
    }

    function transferCertificateAuthority (uint256 certificateId, address to) external _isAuthority(certificateId) {
        _certificateMap[certificateId].authority = to;
        emit TransferCertificateAuthority(certificateId, _msgSender(), to);
    }

    function numReports () external view returns(uint256) {
        return _reportId;
    }

    function publishReport (address[] calldata contractAddresses, string[] calldata domains, string[] calldata tags, string calldata uri) external returns(uint256) {

        // Get report ID:
        uint256 id = _reportId++;

        // Set report data:
        _reportMap[id].reportId = id;
        _reportMap[id].reviewer = _msgSender();
        _reportMap[id].uri = uri;
        _reportMap[id].published = true;

        // Add reportId to contract address mapping set:
        for(uint i; i < contractAddresses.length; i++) {
            _contractReports[contractAddresses[i]].add(id);
        }

        // Emit indexed report references:
        for(uint i = 0; i < contractAddresses.length; i++) {
            emit ContractReported(id, contractAddresses[i]);
        }
        for(uint i = 0; i < domains.length; i++) {
            emit DomainReported(id, domains[i]);
        }
        for(uint i = 0; i < tags.length; i++) {
            emit TagReported(id, tags[i]);
        }

        // Emit Report Publish event:
        emit PublishReport(id, _msgSender());

        return id;
    }

    function unPublishReport (uint256 reportId) external _isReviewer(reportId) {
        _reportMap[reportId].published = false;
        emit UnPublishReport(reportId, _msgSender());
    }

    function getReport (uint256 reportId) external view returns(Report memory) {
        require(reportId < _reportId, "report dne");
        return (_reportMap[reportId]);
    }

    function isReviewer (address reviewer, uint256 reportId) public view returns(bool) {
        require(reportId < _reportId, "report dne");
        return reviewer == _reportMap[reportId].reviewer;
    }

    /**
    * @dev NOTE: O(n*m) time where n is # of reports and m is # of certificates searched
    */
    function getCertifiedContractReports (address contractAddress, uint256[] memory certificateIds) external view returns(Report[] memory) {
        uint256 maxLength = _contractReports[contractAddress].length();
        uint256 numCertified;
        Report[] memory res = new Report[](maxLength);
        for(uint256 i = 0; i < maxLength; i++) {
            uint256 reportId = _contractReports[contractAddress].at(i);
            if(_reportMap[reportId].published) {
                for(uint256 j = 0; j < certificateIds.length; j++) {
                    if(isCertified(_reportMap[reportId].reviewer, certificateIds[j])) {
                        res[numCertified++] = _reportMap[reportId];
                        break;
                    }
                }
            }
        }
        if(numCertified < maxLength) {
            Report[] memory resTrimmed = new Report[](numCertified);
            for(uint256 i = 0; i < numCertified; i++) {
                resTrimmed[i] = res[i];
            }
            res = resTrimmed;
        }
        return res;
    }

    function isCertificateAuthority (address authority, uint256 certificateId) public view returns(bool) {
        return authority == _certificateMap[certificateId].authority;
    }

    function isCertified (address reviewer, uint256 certificateId) public view returns(bool) {
        return _certificateIssued[certificateId][reviewer];
    }

}