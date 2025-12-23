import { CID } from 'multiformats/cid'
import { check } from '@atproto/common-web'
import { RepoRecord } from '@atproto/lexicon'
import { BlockMap } from '../block-map'
import { CommitData } from '../types'

// Web platform compatible stream type.
// Node.js Readable streams implement AsyncIterable, so they work directly.
// Web ReadableStreams can be converted using stream[Symbol.asyncIterator]() or
// by using a library like 'stream-consumers'.
export type BlobStream = AsyncIterable<Uint8Array>

export interface RepoStorage {
  // Writable
  getRoot(): Promise<CID | null>
  putBlock(cid: CID, block: Uint8Array, rev: string): Promise<void>
  putMany(blocks: BlockMap, rev: string): Promise<void>
  updateRoot(cid: CID, rev: string): Promise<void>
  applyCommit(commit: CommitData)

  // Readable
  getBytes(cid: CID): Promise<Uint8Array | null>
  has(cid: CID): Promise<boolean>
  getBlocks(cids: CID[]): Promise<{ blocks: BlockMap; missing: CID[] }>
  attemptRead<T>(
    cid: CID,
    def: check.Def<T>,
  ): Promise<{ obj: T; bytes: Uint8Array } | null>
  readObjAndBytes<T>(
    cid: CID,
    def: check.Def<T>,
  ): Promise<{ obj: T; bytes: Uint8Array }>
  readObj<T>(cid: CID, def: check.Def<T>): Promise<T>
  attemptReadRecord(cid: CID): Promise<RepoRecord | null>
  readRecord(cid: CID): Promise<RepoRecord>
}

export interface BlobStore {
  putTemp(bytes: Uint8Array | BlobStream): Promise<string>
  makePermanent(key: string, cid: CID): Promise<void>
  putPermanent(cid: CID, bytes: Uint8Array | BlobStream): Promise<void>
  quarantine(cid: CID): Promise<void>
  unquarantine(cid: CID): Promise<void>
  getBytes(cid: CID): Promise<Uint8Array>
  getStream(cid: CID): Promise<BlobStream>
  hasTemp(key: string): Promise<boolean>
  hasStored(cid: CID): Promise<boolean>
  delete(cid: CID): Promise<void>
  deleteMany(cid: CID[]): Promise<void>
}

export class BlobNotFoundError extends Error {}
