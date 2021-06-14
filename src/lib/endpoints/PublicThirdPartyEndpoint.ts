import { Certificate } from '@relaycorp/relaynet-core';
import bufferToArray from 'buffer-to-arraybuffer';
import isValidDomain from 'is-valid-domain';
import { getRepository } from 'typeorm';

import { PublicThirdPartyEndpoint as PublicThirdPartyEndpointEntity } from '../entities/PublicThirdPartyEndpoint';
import InvalidEndpointError from './InvalidEndpointError';
import { ThirdPartyEndpoint } from './ThirdPartyEndpoint';

export class PublicThirdPartyEndpoint extends ThirdPartyEndpoint {
  public static async import(
    publicAddress: string,
    identityCertificateSerialized: Buffer,
  ): Promise<PublicThirdPartyEndpoint> {
    if (!isValidDomain(publicAddress)) {
      throw new InvalidEndpointError(`${publicAddress} is not a valid public address`);
    }

    let certificate: Certificate;
    try {
      certificate = Certificate.deserialize(bufferToArray(identityCertificateSerialized));
    } catch (err) {
      throw new InvalidEndpointError(err, 'Certificate is malformed');
    }
    try {
      await certificate.validate();
    } catch (err) {
      throw new InvalidEndpointError(err, 'Certificate is well-formed but invalid');
    }

    const endpointRepository = getRepository(PublicThirdPartyEndpointEntity);
    const endpoint = endpointRepository.create({
      expiryDate: certificate.expiryDate,
      identityCertificateSerialized,
      publicAddress,
    });
    await endpointRepository.save(endpoint);

    return new PublicThirdPartyEndpoint(publicAddress, certificate);
  }

  protected constructor(protected publicAddress: string, identityCertificate: Certificate) {
    super(identityCertificate);
  }

  public getAddress(): Promise<string> {
    return Promise.resolve(this.publicAddress);
  }
}
