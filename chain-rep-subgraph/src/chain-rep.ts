import { BigInt } from "@graphprotocol/graph-ts"
import {
  ChainRep,
  ContractReported,
  CreateCertificate,
  DomainReported,
  IssueCertificate,
  PublishReport,
  RevokeCertificate,
  TagReported,
  TransferCertificateAuthority,
  UnPublishReport
} from "../generated/ChainRep/ChainRep"
import { Certificate, CertificateReviewer, ContractAddress, Report, ReportContractAddress, ReportDomain, ReportTag } from "../generated/schema"

export function handleContractReported(event: ContractReported): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  const id = event.params.reportId.toString()
  const contractAddressId = event.params.contractAddress
  const reportContractAddressId = id + '-' + contractAddressId.toHexString()
  let report = Report.load(id)
  let contractAddress = ContractAddress.load(contractAddressId)
  let reportContractAddress = ReportContractAddress.load(reportContractAddressId)

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!report) report = new Report(id) // TODO??
  if (!contractAddress) contractAddress = new ContractAddress(contractAddressId)
  if (!reportContractAddress) reportContractAddress = new ReportContractAddress(reportContractAddressId)

  reportContractAddress.report = id
  reportContractAddress.contractAddress = contractAddressId

  // Entities can be written to the store with `.save()`
  report.save()
  contractAddress.save()
  reportContractAddress.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.createCertificate(...)
  // - contract.getCertifiedContractReports(...)
  // - contract.getReport(...)
  // - contract.isCertificateAuthority(...)
  // - contract.isCertified(...)
  // - contract.isReviewer(...)
  // - contract.numCertificates(...)
  // - contract.numReports(...)
  // - contract.publishReport(...)
}

export function handleCreateCertificate(event: CreateCertificate): void {
  const id = event.params.certificateId.toString()
  const authority = event.params.authority
  const name = event.params.name
  let entity = Certificate.load(id)
  if (!entity) entity = new Certificate(id)

  entity.authority = authority
  entity.name = name

  entity.save()
}

export function handleDomainReported(event: DomainReported): void {
  const id = event.params.reportId.toString()
  const domainId = event.params.domain.toHexString() // TODO?? string
  const reportDomainId = id + '-' + domainId
  let reportDomain = ReportDomain.load(reportDomainId)
  if (!reportDomain) reportDomain = new ReportDomain(reportDomainId)

  reportDomain.report = id
  reportDomain.domain = domainId
  reportDomain.save()
}

export function handleIssueCertificate(event: IssueCertificate): void {
  const certificateId = event.params.certificateId.toString()
  const reviewerId = event.params.reviewer
  const certificateReviewerId = certificateId + '-' + reviewerId.toHexString()
  let certificateReviewer = CertificateReviewer.load(certificateReviewerId)
  if (!certificateReviewer) certificateReviewer = new CertificateReviewer(certificateReviewerId)

  certificateReviewer.certificate = certificateId
  certificateReviewer.reviewer = reviewerId
  certificateReviewer.save()
}

export function handlePublishReport(event: PublishReport): void {
  const id = event.params.reportId.toString()
  const reviewerId = event.params.reviewer
  let report = Report.load(id)
  if (!report) report = new Report(id)

  report.reviewer = reviewerId
  report.published = true
  report.save()
}

export function handleRevokeCertificate(event: RevokeCertificate): void {
  const certificateId = event.params.certificateId.toString()
  const reviewerId = event.params.reviewer
  const certificateReviewerId = certificateId + '-' + reviewerId.toHexString()
  const certificateReviewer = CertificateReviewer.load(certificateReviewerId)
  // TODO?? if (certificateReviewer) certificateReviewer.delete()
}

export function handleTagReported(event: TagReported): void {
  const id = event.params.reportId.toString()
  const tagId = event.params.tag.toHexString()
  const reportTagId = id + '-' + tagId
  let reportTag = ReportTag.load(reportTagId)
  if (!reportTag) reportTag = new ReportTag(reportTagId)

  reportTag.report = id
  reportTag.tag = tagId
  reportTag.save()  
}

export function handleTransferCertificateAuthority(
  event: TransferCertificateAuthority
): void {
  const id = event.params.certificateId.toString()
  let certificate = Certificate.load(id)
  if (!certificate) certificate = new Certificate(id)

  certificate.authority = event.params.to
  certificate.save()
}

export function handleUnPublishReport(event: UnPublishReport): void {
  const id = event.params.reportId.toString()
  let report = Report.load(id)
  if (!report) report = new Report(id)

  report.published = false
  report.save()
}
