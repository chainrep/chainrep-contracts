//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IChainRep {

  struct Report {
    address reviewer;
    address[] contractAddresses;
    string[] domains;
    string[] tags;
    string uri;
  }

  struct Certificate {
    address authority;
    string name;
  }

  event IssueCertificate(uint256 indexed certificateId, address indexed authority, address indexed reviewer);

  event RevokeCertificate(uint256 indexed certificateId, address indexed authority, address indexed reviewer);

  event CreateCertificate(uint256 indexed certificateId, address indexed authority, string name);

  event TransferCertificateAuthority(uint256 indexed certificateId, address indexed from, address indexed to);

  event PublishReport(uint256 indexed reportId, address indexed reviewer, Report report);

  event UnPublishReport(uint256 indexed reportId, address indexed reviewer, Report report);
  
  function numCertificates () external view returns(uint256);

  function issueCertificate (uint256 certificateId, address reviewer) external;

  function revokeCertificate (uint256 certificateId, address reviewer) external;

  function createCertificate (string calldata name) external;

  function transferCertificateAuthority (uint256 certificateId, address to) external;

  function numReports () external view returns(uint256);

  function publishContractReport (address contractAddress, string calldata uri, string[] calldata tags) external;

  function publishDomainReport (string calldata domain, string calldata uri, string[] calldata tags) external;

  function unPublishReport (uint256 reportId) external;

  function getReport (uint256 reportId) external view returns(Report memory);

  function getCertifiedContractReports (address contractAddress, uint256[] memory certifications) external view returns(Report[] memory);

  function getCertifiedDomainReports (string memory domain, uint256[] memory certifications) external view returns(Report[] memory);

  function isCertificateAuthority (address authority, uint256 certificate) external view returns(bool);

  function isCertified (address reviewer, uint256 certificate) external view returns(bool);

  // listCertificates
}

