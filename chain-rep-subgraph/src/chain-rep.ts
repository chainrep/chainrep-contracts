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
import { Certificate, Report } from "../generated/schema"

export function handleContractReported(event: ContractReported): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  const id = event.params.reportId.toString()
  const contractAddress = event.params.contractAddress
  let entity = Report.load(id)

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) entity = new Report(id, event.address, '', true) // TODO??

  // Entity fields can be set based on event parameters
  entity.contractAddress = contractAddress

  // Entities can be written to the store with `.save()`
  entity.save()

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
  if (!entity) entity = new Certificate(id, authority, name) // TODO??

  entity.save()
}

export function handleDomainReported(event: DomainReported): void {}

export function handleIssueCertificate(event: IssueCertificate): void {}

export function handlePublishReport(event: PublishReport): void {}

export function handleRevokeCertificate(event: RevokeCertificate): void {}

export function handleTagReported(event: TagReported): void {}

export function handleTransferCertificateAuthority(
  event: TransferCertificateAuthority
): void {}

export function handleUnPublishReport(event: UnPublishReport): void {}
