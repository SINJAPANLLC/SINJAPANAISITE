import { useState } from "react";

const TEMPLATES = [
  {
    label: "サービス紹介記事",
    template: (kw: string, target: string) => `# ${kw}とは？${target}向け完全ガイド

## はじめに
${kw}について詳しく解説します。

## ${kw}の概要
[ここに概要を記述]

## ${kw}のメリット
1. メリット1
2. メリット2
3. メリット3

## ${target}における活用事例
[具体的な活用事例を記述]

## まとめ
${kw}を活用することで、貴社のビジネスを次のステージへ。
お気軽にご相談ください。

**関連キーワード:** ${kw}, AI導入, DX推進, 業務効率化`,
  },
  {
    label: "比較・解説記事",
    template: (kw: string, target: string) => `# ${kw}を比較！${target}が選ぶべき最適解とは

## この記事でわかること
- ${kw}の種類と特徴
- ${target}に最適な選び方
- 導入時の注意点

## ${kw}の種類
### タイプA
[説明]

### タイプB
[説明]

## ${target}向け比較表
| 項目 | タイプA | タイプB |
|------|---------|---------|
| コスト | ○ | △ |
| 機能 | △ | ○ |

## まとめ
[まとめを記述]`,
  },
];

export function SeoSection() {
  const [keyword, setKeyword] = useState("");
  const [target, setTarget] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [templateIdx, setTemplateIdx] = useState(0);
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!keyword || !target) return;
    setGenerated(TEMPLATES[templateIdx].template(keyword, target));
    setMetaDesc(`${keyword}について${target}向けに徹底解説。導入メリット・活用事例・選び方のポイントを紹介します。合同会社SIN JAPANへのご相談はこちら。`);
  };

  const copy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-black">SEO記事生成</h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div className="bg-white/5 border border-white/10 p-5 flex flex-col gap-4">
            <p className="text-xs font-bold text-gray-400 tracking-wider">記事設定</p>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">メインキーワード</label>
              <input type="text" placeholder="例：AI導入支援" value={keyword} onChange={e => setKeyword(e.target.value)}
                className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">ターゲット読者</label>
              <input type="text" placeholder="例：中小企業の経営者" value={target} onChange={e => setTarget(e.target.value)}
                className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">テンプレート</label>
              <select value={templateIdx} onChange={e => setTemplateIdx(Number(e.target.value))}
                className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none">
                {TEMPLATES.map((t, i) => <option key={i} value={i}>{t.label}</option>)}
              </select>
            </div>
            <button onClick={generate} disabled={!keyword || !target}
              className="h-9 bg-white text-gray-900 text-xs font-bold hover:bg-gray-100 transition-colors disabled:opacity-40">
              記事を生成する
            </button>
          </div>

          {metaDesc && (
            <div className="bg-white/5 border border-white/10 p-5">
              <p className="text-[10px] text-gray-500 mb-2 tracking-wider">メタディスクリプション（{metaDesc.length}文字）</p>
              <p className="text-xs text-gray-300 leading-relaxed">{metaDesc}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-500 tracking-widest uppercase">生成された記事</p>
            {generated && (
              <button onClick={copy} className="text-[10px] font-bold text-gray-400 hover:text-white transition-colors">
                {copied ? "コピー完了！" : "コピー"}
              </button>
            )}
          </div>
          <textarea value={generated} onChange={e => setGenerated(e.target.value)} readOnly={!generated}
            placeholder="上のフォームに入力して「記事を生成する」をクリックしてください"
            className="flex-1 min-h-[400px] bg-white/5 border border-white/10 text-white text-sm p-4 outline-none resize-none font-mono leading-relaxed placeholder:text-gray-700" />
        </div>
      </div>
    </div>
  );
}
