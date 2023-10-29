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
    |- userId: uid // usersドキュメントのdocId
    |- type: 'condition'
    |- createdAt: timestamp
```

### experiments コレクション

```
- [docId]
    |- name: string
    |- userId: uid // usersドキュメントのdocId
    |- conditions: string[]
    |- createdAt: timestamp
    |- stamps サブコレクション
        |- condition: string
        |- experimentId: docId // experimentsドキュメントのdocId
        |- createdAt: string
        |- userId: uid // usersドキュメントのdocId

```
