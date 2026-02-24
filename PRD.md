# 2D縦スクロールシューティングゲーム - 要件定義書

## 1. プロジェクト概要

| 項目 | 内容 |
|---|---|
| プロジェクト名 | Shooting Game |
| ジャンル | 2D縦スクロールシューティング（STG） |
| プラットフォーム | Webブラウザ |
| 技術スタック | TypeScript + Vite + PixiJS v8 |
| スコープ | ミニマム（プロトタイプ） |

## 2. ゲーム仕様

### 2.1 画面構成

| 項目 | 値 |
|---|---|
| ゲーム解像度 | 480 x 720 px（縦長3:4.5） |
| プレイエリア | 384 x 720 px（中央、左右48pxはUI領域） |
| 背景色 | ダークネイビー（0x0a0a2e） |
| フレームレート | 60fps |

### 2.2 シーン遷移

```
TitleScene → [SPACE] → GameScene → [死亡] → GameOverScene → [SPACE] → TitleScene
```

- **TitleScene**: タイトル表示 + "Press SPACE to Start"
- **GameScene**: メインゲームプレイ
- **GameOverScene**: 最終スコア表示 + "Press SPACE to Return"

### 2.3 自機（Player）

| 項目 | 値 |
|---|---|
| 形状 | 三角形（上向き）16x20px / シアン（0x00ffff） |
| 通常速度 | 5 px/frame |
| 低速（集中）モード | 2 px/frame（Shift押下時） |
| 当たり判定 | 4x4px（中心、視覚より小さい） |
| 残機 | 3 |
| 被弾時無敵 | 2秒（120フレーム） |
| 発射レート | 4フレームに1発（毎秒15発） |

**操作:**

| キー | アクション |
|---|---|
| 矢印キー | 8方向移動 |
| Z | ショット（長押しで連射） |
| Shift | 低速移動モード |

**パワーレベル（ショットの種類）:**

| レベル | 内容 |
|---|---|
| 0（初期） | 単発直進弾 |
| 1 | 2連射（やや左右に開く） |
| 2（最大） | 3連射（中央 + 斜め2発） |

### 2.4 敵キャラクター

**Type A "Drone"（小型・高速）**

| 項目 | 値 |
|---|---|
| 形状 | 赤い円（半径12px） |
| HP | 1 |
| 速度 | 3 px/frame |
| 移動 | 上から出現、サイン波で下降 |
| 攻撃 | 60フレーム毎に自機狙い単発弾 |
| スコア | 100点 |

**Type B "Tank"（中型・耐久）**

| 項目 | 値 |
|---|---|
| 形状 | オレンジの矩形（24x24px） |
| HP | 5 |
| 速度 | 1.5 px/frame |
| 移動 | 直進下降 → y=150で120フレーム停止 → 退場 |
| 攻撃 | 停止中90フレーム毎に3way弾 |
| スコア | 300点 |

**Type C "Spinner"（変則）**

| 項目 | 値 |
|---|---|
| 形状 | 黄色い三角形（回転）16x16px |
| HP | 3 |
| 速度 | 2 px/frame |
| 移動 | 横から出現、螺旋・円形パターン |
| 攻撃 | 120フレーム毎に全方位8way弾 |
| スコア | 500点 |

### 2.5 ボス "Guardian"

| 項目 | 値 |
|---|---|
| 形状 | 大型六角形（64x64px）ダークレッド + 明赤枠 |
| HP | 100 |
| 移動 | 上から出現 → y=80で左右に揺動 |
| Phase 1（HP > 50） | 60フレーム毎に自機狙い5way弾 |
| Phase 2（HP ≤ 50） | 上記 + 90フレーム毎に全方位16way弾、移動速度UP |
| スコア | 5000点 |
| 撃破演出 | 白フラッシュ + パーティクル爆発 → ステージクリア |

### 2.6 弾丸仕様

**自機弾:**

| 項目 | 値 |
|---|---|
| 形状 | 白い矩形（4x12px） |
| 速度 | 12 px/frame |
| ダメージ | 1 |

**敵弾:**

| 項目 | 値 |
|---|---|
| 形状 | 小円（半径3px）マゼンタ or 赤 |
| 速度 | 4 px/frame（狙い弾）/ 3 px/frame（全方位弾） |

**弾幕パターン:**

1. **狙い弾**: 発射時の自機方向へ直進
2. **3way弾**: 狙い弾 ±15度の3方向
3. **全方位弾**: 等間隔（8way=45度 / 16way=22.5度）

### 2.7 アイテム

**パワーアップ（P）**

| 項目 | 値 |
|---|---|
| 形状 | 緑のひし形（12x12px） |
| 出現率 | 敵撃破時30% |
| 効果 | パワーレベル+1（最大2） |
| 落下速度 | 2 px/frame |

※ 被弾時パワーレベルは0にリセット

### 2.8 スコアシステム

- 敵撃破: 種類別スコア（100/300/500/5000）
- UIに常時表示（右上）
- ゲームオーバー時に最終スコア表示

### 2.9 ステージ構成（1ステージ、約2分30秒）

| 時間 | 内容 |
|---|---|
| 0:00 - 0:15 | Drone 3波（各5体）- 導入 |
| 0:15 - 0:30 | Tank 2体 + Drone 8体 |
| 0:30 - 0:50 | Spinner登場（左右から各3体） |
| 0:50 - 1:10 | 混成（Tank中央 + Drone両翼） |
| 1:10 - 1:30 | Drone大群（15体）+ Spinner 2体 |
| 1:30 - 1:50 | Tank 3体編隊 + Spinner |
| 1:50 - 2:00 | 小休止（Drone 2-3体） |
| 2:00 - 2:30 | **ボス戦 "Guardian"** |

## 3. 技術設計

### 3.1 アーキテクチャ方針

- **Reactは不使用**: ゲームループにDOMは不要。PixiJS + TypeScriptのみで構築
- **エンティティシステム**: シンプルなクラス継承（ECSは過剰）
- **衝突判定**: AABB（軸平行バウンディングボックス）
- **オブジェクトプール**: 弾丸・敵の生成/破棄によるGC負荷を回避
- **シーン管理**: 軽量な自作SceneManager（3シーンのみ）

### 3.2 ファイル構成

```
src/
  main.ts                          # エントリポイント
  game/
    Game.ts                        # トップレベルゲームコントローラ
    SceneManager.ts                # シーン遷移管理
    scenes/
      Scene.ts                     # シーン基底インターフェース
      TitleScene.ts                # タイトル画面
      GameScene.ts                 # メインゲームプレイ
      GameOverScene.ts             # ゲームオーバー画面
    entities/
      Entity.ts                    # エンティティ基底クラス
      Player.ts                    # 自機
      Enemy.ts                     # 敵（設定で種類を変更）
      Bullet.ts                    # 自機弾
      EnemyBullet.ts               # 敵弾
      PowerUp.ts                   # パワーアップアイテム
      Boss.ts                      # ボス
    systems/
      KeyboardManager.ts           # キーボード入力
      CollisionSystem.ts           # 衝突判定
      ObjectPool.ts                # オブジェクトプール
      BulletPatterns.ts            # 弾幕パターン生成
      StageManager.ts              # ウェーブ/ステージ進行管理
      ParticleSystem.ts            # パーティクル演出
    data/
      stage1.ts                    # ステージ1ウェーブ定義
      enemyConfig.ts               # 敵タイプ設定
    ui/
      HUD.ts                       # スコア・残機・パワー表示
    utils/
      math.ts                      # 角度計算、clamp等
      constants.ts                 # ゲーム定数
      graphics.ts                  # 図形描画ファクトリ
```

### 3.3 変更が必要な既存ファイル

| ファイル | 変更内容 |
|---|---|
| `index.html` | エントリポイントを `/src/main.ts` に変更、CSS追加 |
| `vite.config.ts` | React plugin削除 |
| `tsconfig.app.json` | JSX設定削除 |

### 3.4 依存関係の変更

```bash
npm install pixi.js@^8
```

React関連パッケージは削除可能（任意）。

## 4. 非機能要件

| 項目 | 要件 |
|---|---|
| パフォーマンス | 60fps安定（エンティティ300体以下想定） |
| ブラウザ対応 | モダンブラウザ（Chrome, Firefox, Safari, Edge） |
| レスポンシブ | キャンバスをウィンドウ中央に配置、アスペクト比維持 |
| 入力 | キーボードのみ（タッチ非対応） |

## 5. スコープ外（将来対応）

- タッチ / ゲームパッド対応
- BGM・効果音
- 複数ステージ
- スコアランキング / 保存
- 難易度選択
- コンティニュー機能

## 6. 実装タスク

- [x] Task 1: プロジェクトセットアップ — PixiJS導入、Vite/TS設定変更、エントリポイント作成
- [x] Task 2: コアユーティリティ — constants.ts, math.ts, graphics.ts
- [ ] Task 3: 入力・基盤システム — KeyboardManager.ts, Entity.ts, Scene.ts, SceneManager.ts
- [ ] Task 4: ゲームコントローラ・タイトル画面 — Game.ts, TitleScene.ts, main.ts接続
- [ ] Task 5: 自機・自機弾 — Player.ts, Bullet.ts, ObjectPool.ts
- [ ] Task 6: 敵システム — enemyConfig.ts, Enemy.ts, EnemyBullet.ts, BulletPatterns.ts
- [ ] Task 7: アイテム・衝突判定 — PowerUp.ts, CollisionSystem.ts
- [ ] Task 8: HUD — HUD.ts（スコア・残機・パワー表示）
- [ ] Task 9: ステージ管理 — stage1.ts, StageManager.ts
- [ ] Task 10: ボス・パーティクル — Boss.ts, ParticleSystem.ts
- [ ] Task 11: GameScene統合 — GameScene.ts（全システム結合）
- [ ] Task 12: ゲームオーバー・最終結合 — GameOverScene.ts、ゲームループ完成
