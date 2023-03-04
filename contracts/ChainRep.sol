//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IChainRep } from "./IChainRep.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";

contract ChainRep is IChainRep, Context {

  uint256 private _certificateId;
  uint256 private _reportId;

  mapping(uint256 => mapping(address => bool)) private _certificateIssued;
  mapping(uint256 => Certificate) private _certificateMap;
  mapping(uint256 => Report) private _reportMap;
  mapping(address => uint256[]) private _contractReports;
  mapping(string => uint256[]) private _domainReports;

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

  function publishContractReport (address contractAddress, string calldata uri, string[] calldata tags) external {

  }

  function publishDomainReport (string calldata domain, string calldata uri, string[] calldata tags) external {

  }

  // function getReport (uint256 reportId) external view returns(Report memory)

  // function getCertifiedContractReports (address contractAddress, uint256[] memory certifications) external view returns(Report[] memory)

  // function getCertifiedDomainReports (string memory domain, uint256[] memory certifications) external view returns(Report[] memory)

  // function isCertificateAuthority (address authority, uint256 certificate) public view returns(bool)

  // function isCertified (address reviewer, uint256 certificate) public view returns(bool)

}