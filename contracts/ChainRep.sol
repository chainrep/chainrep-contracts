//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IChainRep } from "./IChainRep.sol";

contract ChainRep is IChainRep {

  uint256 private _certificateId;
  uint256 private _reportId;

  mapping(uint256 => mapping(address => bool)) private _certificateMap;
  mapping(uint256 => Report) private _reportMap;
  mapping(address => uint256[]) private _contractReports;
  mapping(string => uint256[]) private _domainReports;

  constructor() { }

  function numCertificates () external view returns(uint256) {
    return _certificateId;
  }

  
  function issueCertificate (uint256 certificateId, address reviewer) external {
    
  }

  function revokeCertificate (uint256 certificateId, address reviewer) external {

  }

  function createCertificate (string calldata name) external {

  }

  function transferCertificateAuthority (uint256 certificateId, address to) external {

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