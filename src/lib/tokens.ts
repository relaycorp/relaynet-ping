import { GSCClient } from '@relaycorp/relaynet-core';
import { Paths } from 'env-paths';
import { Logger } from 'pino';
import { Token } from 'typedi';

export const APP_DIRS = new Token<Paths>('APP_DIRS');

export const LOGGER = new Token<Logger>('LOGGER');

export const GSC_CLIENT = new Token<GSCClient>('GSC_CLIENT');
