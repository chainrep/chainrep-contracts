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

    modifier isAuthority(uint256 certificateId) {
        require(_certificateMap[certificateId].authority == _msgSender(), "not authority");
        _;
    }

    function numCertificates () external view returns(uint256) {
        return _certificateId;
    }

    function issueCertificate (uint256 certificateId, address reviewer) external isAuthority(certificateId) {
        require(!_certificateIssued[certificateId][reviewer], "already issued");
        _certificateIssued[certificateId][reviewer] = true;
        emit IssueCertificate(certificateId, _msgSender(), reviewer);
    }

    function revokeCertificate (uint256 certificateId, address reviewer) external isAuthority(certificateId) {
        require(_certificateIssued[certificateId][reviewer], "not issued");
        delete _certificateIssued[certificateId][reviewer];
        emit RevokeCertificate(certificateId, _msgSender(), reviewer);
    }

    function createCertificate (string calldata name) external {
        uint256 id = _certificateId++;
        _certificateMap[id].name = name;
        _certificateMap[id].authority = _msgSender();
        emit CreateCertificate(id, _msgSender(), name);
    }

    function transferCertificateAuthority (uint256 certificateId, address to) external isAuthority(certificateId) {
        _certificateMap[certificateId].authority = to;
        emit TransferCertificateAuthority(certificateId, _msgSender(), to);
    }

    function numReports () external view returns(uint256) {
        return _reportId;
    }

    function publishReport (address[] calldata contractAddresses, string[] calldata domains, string[] calldata tags, string calldata uri) external {
        uint256 id = _reportId++;
        _reportMap[id].reviewer = _msgSender();
        _reportMap[id].contractAddresses = contractAddresses;
        _reportMap[id].domains = domains;
        _reportMap[id].tags = tags;
        _reportMap[id].uri = uri;
        emit PublishReport(id, _msgSender(), _reportMap[id]);
    }

    function unPublishReport (uint256 reportId) external {
        Report memory report = _reportMap[reportId];
        for(uint256 i; i < report.contractAddresses.length; i++) {
            _contractReports[report.contractAddresses[i]].remove(reportId);
        }
    }

    function getReport (uint256 reportId) external view returns(Report memory) {
        require(reportId < _reportId, "report dne");
        return _reportMap[reportId];
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
            for(uint256 j = 0; j < certificateIds.length; j++) {
                if(isCertified(_reportMap[reportId].reviewer, certificateIds[j])) {
                    res[numCertified++] = _reportMap[reportId];
                    break;
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