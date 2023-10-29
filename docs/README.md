# 実験用: labeling tool

実験のラベリングを楽にするためのツール．
タイムスタンプを記録する．

## DB スキーマ

### users コレクション

```
- [docId]
    |- userId: string
    |- createdAt: timestamp
```

### labels コレクション

```
- [docId]
    |- name: string
    |- type: 'condition'
    |- createdAt: timestamp
```

### experiments コレクション

```
- [docId]
    |- name: string
    |- conditions: string[]
    |- createdAt: timestamp
    |- stamps サブコレクション
        |- condition: string
        |- experimentId: docId // experimentsドキュメントのdocId
        |- createdAt: string

```
