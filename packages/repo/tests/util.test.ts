import { CID } from 'multiformats/cid'
import {
  dataToCborBlock,
  cborToLex,
  cborToLexRecord,
  cidForRecord,
  parseDataKey,
  formatDataKey,
} from '../src/util'

describe('util', () => {
  describe('dataToCborBlock', () => {
    it('encodes simple objects to CBOR and returns CID', async () => {
      const data = { hello: 'world', count: 42 }
      const block = await dataToCborBlock(data)

      expect(block.cid).toBeInstanceOf(CID)
      expect(block.bytes).toBeInstanceOf(Uint8Array)
      expect(block.bytes.length).toBeGreaterThan(0)
    })

    it('produces consistent CIDs for same data', async () => {
      const data = { test: 'consistency', value: 123 }
      const block1 = await dataToCborBlock(data)
      const block2 = await dataToCborBlock(data)

      expect(block1.cid.equals(block2.cid)).toBe(true)
      expect(block1.bytes).toEqual(block2.bytes)
    })

    it('produces different CIDs for different data', async () => {
      const block1 = await dataToCborBlock({ a: 1 })
      const block2 = await dataToCborBlock({ a: 2 })

      expect(block1.cid.equals(block2.cid)).toBe(false)
    })

    it('handles nested objects', async () => {
      const data = {
        nested: {
          deep: {
            value: 'test',
          },
        },
        array: [1, 2, 3],
      }
      const block = await dataToCborBlock(data)

      expect(block.cid).toBeInstanceOf(CID)
      expect(block.bytes.length).toBeGreaterThan(0)
    })

    it('handles arrays', async () => {
      const data = [1, 'two', { three: 3 }]
      const block = await dataToCborBlock(data)

      expect(block.cid).toBeInstanceOf(CID)
    })

    it('handles empty objects', async () => {
      const block = await dataToCborBlock({})

      expect(block.cid).toBeInstanceOf(CID)
    })
  })

  describe('cborToLex', () => {
    it('round-trips simple objects through CBOR encoding', async () => {
      const original = { hello: 'world', count: 42 }
      const block = await dataToCborBlock(original)
      const decoded = cborToLex(block.bytes)

      expect(decoded).toEqual(original)
    })

    it('round-trips nested objects', async () => {
      const original = {
        nested: { value: 'test' },
        array: [1, 2, 3],
      }
      const block = await dataToCborBlock(original)
      const decoded = cborToLex(block.bytes)

      expect(decoded).toEqual(original)
    })

    it('round-trips arrays', async () => {
      const original = [1, 'two', { three: 3 }]
      const block = await dataToCborBlock(original)
      const decoded = cborToLex(block.bytes)

      expect(decoded).toEqual(original)
    })

    it('handles primitive values', async () => {
      const testCases = ['string', 123, true, false, null]

      for (const original of testCases) {
        const block = await dataToCborBlock(original)
        const decoded = cborToLex(block.bytes)
        expect(decoded).toEqual(original)
      }
    })
  })

  describe('cborToLexRecord', () => {
    it('decodes CBOR to a record object', async () => {
      const original = { $type: 'app.bsky.feed.post', text: 'Hello!' }
      const block = await dataToCborBlock(original)
      const record = cborToLexRecord(block.bytes)

      expect(record).toEqual(original)
    })

    it('throws when decoding non-object values', async () => {
      const block = await dataToCborBlock([1, 2, 3])

      expect(() => cborToLexRecord(block.bytes)).toThrow(
        'lexicon records be a json object',
      )
    })

    it('throws when decoding primitive values', async () => {
      const block = await dataToCborBlock('just a string')

      expect(() => cborToLexRecord(block.bytes)).toThrow(
        'lexicon records be a json object',
      )
    })
  })

  describe('cidForRecord', () => {
    it('generates CID for a record', async () => {
      const record = { $type: 'app.bsky.feed.post', text: 'Hello!' }
      const cid = await cidForRecord(record)

      expect(cid).toBeInstanceOf(CID)
    })

    it('produces consistent CIDs for same record', async () => {
      const record = { $type: 'app.bsky.feed.post', text: 'Test' }
      const cid1 = await cidForRecord(record)
      const cid2 = await cidForRecord(record)

      expect(cid1.equals(cid2)).toBe(true)
    })

    it('produces different CIDs for different records', async () => {
      const cid1 = await cidForRecord({ text: 'one' })
      const cid2 = await cidForRecord({ text: 'two' })

      expect(cid1.equals(cid2)).toBe(false)
    })

    it('matches CID from dataToCborBlock for same data', async () => {
      const record = { $type: 'app.bsky.feed.post', text: 'Consistency test' }
      const cidFromRecord = await cidForRecord(record)
      const block = await dataToCborBlock(record)

      expect(cidFromRecord.equals(block.cid)).toBe(true)
    })
  })

  describe('parseDataKey', () => {
    it('parses collection/rkey format', () => {
      const result = parseDataKey('app.bsky.feed.post/abc123')

      expect(result).toEqual({
        collection: 'app.bsky.feed.post',
        rkey: 'abc123',
      })
    })

    it('throws on invalid key format', () => {
      expect(() => parseDataKey('invalid')).toThrow('Invalid record key')
      expect(() => parseDataKey('too/many/parts')).toThrow('Invalid record key')
      expect(() => parseDataKey('')).toThrow('Invalid record key')
    })
  })

  describe('formatDataKey', () => {
    it('formats collection and rkey', () => {
      const result = formatDataKey('app.bsky.feed.post', 'abc123')

      expect(result).toBe('app.bsky.feed.post/abc123')
    })

    it('round-trips with parseDataKey', () => {
      const collection = 'com.example.record'
      const rkey = 'my-record-key'
      const formatted = formatDataKey(collection, rkey)
      const parsed = parseDataKey(formatted)

      expect(parsed.collection).toBe(collection)
      expect(parsed.rkey).toBe(rkey)
    })
  })
})
