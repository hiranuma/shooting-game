#!/bin/bash
trap "echo -e '\n🛑 中断されました。'; exit 1" INT

MAX_ITERATIONS=15
echo "🚀 Ralph Loop 起動..."

for ((i=1; i<=MAX_ITERATIONS; i++)); do
  echo "========================================="
  echo " 🔄 ループ $i 回目"
  echo "========================================="
  
  # プロンプト定義
  PROMPT=$(cat << 'EOF'
あなたはRalph Loop内で動く自律型AIです。
1. PRD.mdとprogress.txtを確認。
2. 未完了タスクを上から1つだけ実装。
3. 実装後、progress.txtに完了報告を追記し、PRD.mdのチェックを[x]にする。
4. 全タスク完了なら'.loop_status'を'PROJECT_COMPLETED'に書き換える。
人間への質問は不要。1タスクで即終了せよ。
EOF
)

  # リアルタイム表示を維持して実行
  script -q /dev/null claude -p "$PROMPT" --dangerously-skip-permissions

  # Git自動コミット
  if [ -n "$(git status --porcelain)" ]; then
      MSG=$(tail -n 1 progress.txt | sed 's/^- //')
      git add .
      git commit -m "Ralph Loop $i: ${MSG:-Auto Commit}"
      echo "✅ コミット完了"
  fi

  # 終了判定
  if grep -q "PROJECT_COMPLETED" .loop_status; then
    echo "🎉 プロジェクト完了！"
    break
  fi
  
  echo "⌛ 5秒後に次タスクへ..."
  sleep 5
done