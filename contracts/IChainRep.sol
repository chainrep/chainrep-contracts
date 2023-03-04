//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IChainRep {

    struct Report {
        address reviewer;
        string uri;
        bool published;
    }

    struct Certificate {
        address authority;
        string name;
    }

    event IssueCertificate(uint256 indexed certificateId, address indexed authority, address indexed reviewer);

    event RevokeCertificate(uint256 indexed certificateId, address indexed authority, address indexed reviewer);

    event CreateCertificate(uint256 indexed certificateId, address indexed authority, string name);

    event TransferCertificateAuthority(uint256 indexed certificateId, address indexed from, address indexed to);

    event PublishReport(uint256 indexed reportId, address indexed reviewer);

    event ContractReported(uint256 indexed reportId, address indexed contractAddress);

    event DomainReported(uint256 indexed reportId, string indexed domain);

    event TagReported(uint256 indexed reportId, string indexed tag);

    event UnPublishReport(uint256 indexed reportId, address indexed reviewer);

    function numCertificates () external view returns(uint256);

    function issueCertificate (uint256 certificateId, address reviewer) external;

    function revokeCertificate (uint256 certificateId, address reviewer) external;

    function createCertificate (string calldata name) external returns(uint256);

    function transferCertificateAuthority (uint256 certificateId, address to) external;

    function numReports () external view returns(uint256);

    function publishReport (address[] calldata contractAddresses, string[] calldata domains, string[] calldata tags, string calldata uri) external returns(uint256);

    function unPublishReport (uint256 reportId) external;

    function getReport (uint256 reportId) external view returns(Report memory);

    function isReviewer (address reviewer, uint256 reportId) external view returns(bool);

    function getCertifiedContractReports (address contractAddress, uint256[] memory certificateIds) external view returns(Report[] memory);

    function isCertificateAuthority (address authority, uint256 certificateId) external view returns(bool);

    function isCertified (address reviewer, uint256 certificateId) external view returns(bool);

    // listCertificates
}

