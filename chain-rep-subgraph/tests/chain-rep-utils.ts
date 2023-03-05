import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
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

export function createContractReportedEvent(
  reportId: BigInt,
  contractAddress: Address
): ContractReported {
  let contractReportedEvent = changetype<ContractReported>(newMockEvent())

  contractReportedEvent.parameters = new Array()

  contractReportedEvent.parameters.push(
    new ethereum.EventParam(
      "reportId",
      ethereum.Value.fromUnsignedBigInt(reportId)
    )
  )
  contractReportedEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )

  return contractReportedEvent
}

export function createCreateCertificateEvent(
  certificateId: BigInt,
  authority: Address,
  name: string
): CreateCertificate {
  let createCertificateEvent = changetype<CreateCertificate>(newMockEvent())

  createCertificateEvent.parameters = new Array()

  createCertificateEvent.parameters.push(
    new ethereum.EventParam(
      "certificateId",
      ethereum.Value.fromUnsignedBigInt(certificateId)
    )
  )
  createCertificateEvent.parameters.push(
    new ethereum.EventParam("authority", ethereum.Value.fromAddress(authority))
  )
  createCertificateEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return createCertificateEvent
}

export function createDomainReportedEvent(
  reportId: BigInt,
  domain: string
): DomainReported {
  let domainReportedEvent = changetype<DomainReported>(newMockEvent())

  domainReportedEvent.parameters = new Array()

  domainReportedEvent.parameters.push(
    new ethereum.EventParam(
      "reportId",
      ethereum.Value.fromUnsignedBigInt(reportId)
    )
  )
  domainReportedEvent.parameters.push(
    new ethereum.EventParam("domain", ethereum.Value.fromString(domain))
  )

  return domainReportedEvent
}

export function createIssueCertificateEvent(
  certificateId: BigInt,
  authority: Address,
  reviewer: Address
): IssueCertificate {
  let issueCertificateEvent = changetype<IssueCertificate>(newMockEvent())

  issueCertificateEvent.parameters = new Array()

  issueCertificateEvent.parameters.push(
    new ethereum.EventParam(
      "certificateId",
      ethereum.Value.fromUnsignedBigInt(certificateId)
    )
  )
  issueCertificateEvent.parameters.push(
    new ethereum.EventParam("authority", ethereum.Value.fromAddress(authority))
  )
  issueCertificateEvent.parameters.push(
    new ethereum.EventParam("reviewer", ethereum.Value.fromAddress(reviewer))
  )

  return issueCertificateEvent
}

export function createPublishReportEvent(
  reportId: BigInt,
  reviewer: Address
): PublishReport {
  let publishReportEvent = changetype<PublishReport>(newMockEvent())

  publishReportEvent.parameters = new Array()

  publishReportEvent.parameters.push(
    new ethereum.EventParam(
      "reportId",
      ethereum.Value.fromUnsignedBigInt(reportId)
    )
  )
  publishReportEvent.parameters.push(
    new ethereum.EventParam("reviewer", ethereum.Value.fromAddress(reviewer))
  )

  return publishReportEvent
}

export function createRevokeCertificateEvent(
  certificateId: BigInt,
  authority: Address,
  reviewer: Address
): RevokeCertificate {
  let revokeCertificateEvent = changetype<RevokeCertificate>(newMockEvent())

  revokeCertificateEvent.parameters = new Array()

  revokeCertificateEvent.parameters.push(
    new ethereum.EventParam(
      "certificateId",
      ethereum.Value.fromUnsignedBigInt(certificateId)
    )
  )
  revokeCertificateEvent.parameters.push(
    new ethereum.EventParam("authority", ethereum.Value.fromAddress(authority))
  )
  revokeCertificateEvent.parameters.push(
    new ethereum.EventParam("reviewer", ethereum.Value.fromAddress(reviewer))
  )

  return revokeCertificateEvent
}

export function createTagReportedEvent(
  reportId: BigInt,
  tag: string
): TagReported {
  let tagReportedEvent = changetype<TagReported>(newMockEvent())

  tagReportedEvent.parameters = new Array()

  tagReportedEvent.parameters.push(
    new ethereum.EventParam(
      "reportId",
      ethereum.Value.fromUnsignedBigInt(reportId)
    )
  )
  tagReportedEvent.parameters.push(
    new ethereum.EventParam("tag", ethereum.Value.fromString(tag))
  )

  return tagReportedEvent
}

export function createTransferCertificateAuthorityEvent(
  certificateId: BigInt,
  from: Address,
  to: Address
): TransferCertificateAuthority {
  let transferCertificateAuthorityEvent = changetype<
    TransferCertificateAuthority
  >(newMockEvent())

  transferCertificateAuthorityEvent.parameters = new Array()

  transferCertificateAuthorityEvent.parameters.push(
    new ethereum.EventParam(
      "certificateId",
      ethereum.Value.fromUnsignedBigInt(certificateId)
    )
  )
  transferCertificateAuthorityEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferCertificateAuthorityEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return transferCertificateAuthorityEvent
}

export function createUnPublishReportEvent(
  reportId: BigInt,
  reviewer: Address
): UnPublishReport {
  let unPublishReportEvent = changetype<UnPublishReport>(newMockEvent())

  unPublishReportEvent.parameters = new Array()

  unPublishReportEvent.parameters.push(
    new ethereum.EventParam(
      "reportId",
      ethereum.Value.fromUnsignedBigInt(reportId)
    )
  )
  unPublishReportEvent.parameters.push(
    new ethereum.EventParam("reviewer", ethereum.Value.fromAddress(reviewer))
  )

  return unPublishReportEvent
}
