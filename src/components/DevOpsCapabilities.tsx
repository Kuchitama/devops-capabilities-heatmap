import React, { useState, useEffect } from 'react';
// import { Card } from '@/components/ui/card';
// import * as HoverCard from '@radix-ui/react-hover-card';
import { Card, CardHeader, CardContent } from './ui/card'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

const getMaturityColor = (level) => {
  switch (level) {
    case 1: return 'bg-red-500';
    case 2: return 'bg-orange-500';
    case 3: return 'bg-sky-500';
    case 4: return 'bg-blue-600';
    default: return 'bg-gray-500';
  }
};

const getMaturityLabel = (level) => {
  switch (level) {
    case 1: return '初期段階';
    case 2: return '発展段階';
    case 3: return '確立段階';
    case 4: return '最適化段階';
    default: return '未評価';
  }
};

const MaturityFilter = ({ selectedLevels, onChange }) => {
  const levels = [1, 2, 3, 4];
  
  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-bold mb-4">習熟度フィルター:</h3>
      <div className="flex flex-wrap gap-4">
        {levels.map(level => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`flex items-center space-x-2 p-2 rounded-lg transition-all
              ${selectedLevels.includes(level) 
                ? `${getMaturityColor(level)} text-white` 
                : 'bg-gray-200 text-gray-600'}`}
          >
            <div className="w-4 h-4 bg-white/20 rounded"></div>
            <span>レベル{level}</span>
          </button>
        ))}
        {selectedLevels.length > 0 && (
          <button
            onClick={() => onChange('clear')}
            className="p-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all"
          >
            クリア
          </button>
        )}
      </div>
    </div>
  );
};

const CapabilityCard = ({ name, level, isFiltered }) => {
  return (
    <CardContent>
    <div 
      className={`p-2 rounded-lg text-sm transition-all duration-200 hover:scale-105
                  ${isFiltered 
                    ? `${getMaturityColor(level)} text-white` 
                    : 'bg-gray-200/50 text-gray-500'}`}
    >
      <div className="text-center font-medium">{name}</div>
      <div className="flex flex-col items-center mt-1">
        <div className="flex justify-center items-center">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full mx-0.5 
                        ${isFiltered 
                          ? i < level ? 'bg-white' : 'bg-white/30'
                          : i < level ? 'bg-gray-500' : 'bg-gray-300'
                        }`}
            />
          ))}
        </div>
        <div className={`text-xs mt-1 ${isFiltered ? 'text-white' : 'text-gray-500'}`}>
          {getMaturityLabel(level)}
        </div>
      </div>
    </div>
    </CardContent>
  );
};

const ScrollButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 transform -translate-y-1/2 z-10 
                bg-white/90 hover:bg-white p-2 rounded-full shadow-lg 
                text-gray-600 hover:text-gray-800 transition-all
                ${direction === 'left' ? 'left-2' : 'right-2'}`}
  >
    {direction === 'left' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
  </button>
);

const MaturityLegend = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 sticky bottom-0 z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-gray-50 rounded-t-lg flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <h3 className="font-bold">習熟度レベルの説明</h3>
        {isOpen ? (
          <ChevronDown className="h-5 w-5" />
        ) : (
          <ChevronUp className="h-5 w-5" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 bg-gray-50 rounded-b-lg shadow-lg border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>レベル1: 初期段階 - 基本的な理解と限定的な実践</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span>レベル2: 発展段階 - 実践的な適用と部分的な統合</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-sky-500 rounded"></div>
              <span>レベル3: 確立段階 - 体系的な実践と組織的な展開</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>レベル4: 最適化段階 - 継続的な改善と革新的な活用</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DevOpsCapabilities = () => {
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [capabilities, setCapabilities] = useState([]);
  const [isWideScreen, setIsWideScreen] = useState(false);
  const scrollContainerRef = React.useRef(null);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsWideScreen(window.innerWidth >= 1280);
    };

    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  useEffect(() => {
    const getRandomLevel = () => Math.floor(Math.random() * 4) + 1;

    const initialCapabilities = [
      {
        category: "文化・組織",
        items: [
          { name: "クロスファンクショナルな協働", level: getRandomLevel() },
          { name: "継続的な学習と改善", level: getRandomLevel() },
          { name: "失敗から学ぶ文化", level: getRandomLevel() },
          { name: "データドリブンな意思決定", level: getRandomLevel() },
          { name: "変更への柔軟性", level: getRandomLevel() }
        ]
      },
      {
        category: "プロセス",
        items: [
          { name: "アジャイル開発", level: getRandomLevel() },
          { name: "CI/CD", level: getRandomLevel() },
          { name: "継続的デプロイメント", level: getRandomLevel() },
          { name: "IaC", level: getRandomLevel() },
          { name: "構成管理", level: getRandomLevel() },
          { name: "リリース管理", level: getRandomLevel() }
        ]
      },
      {
        category: "技術",
        items: [
          { name: "バージョン管理", level: getRandomLevel() },
          { name: "自動化ツール", level: getRandomLevel() },
          { name: "コンテナ化", level: getRandomLevel() },
          { name: "オーケストレーション", level: getRandomLevel() },
          { name: "クラウド活用", level: getRandomLevel() },
          { name: "マイクロサービス", level: getRandomLevel() }
        ]
      },
      {
        category: "モニタリング",
        items: [
          { name: "アプリケーション監視", level: getRandomLevel() },
          { name: "インフラ監視", level: getRandomLevel() },
          { name: "ログ分析", level: getRandomLevel() },
          { name: "パフォーマンス管理", level: getRandomLevel() },
          { name: "セキュリティ監視", level: getRandomLevel() },
          { name: "インシデント管理", level: getRandomLevel() }
        ]
      },
      {
        category: "セキュリティ",
        items: [
          { name: "セキュリティテスト自動化", level: getRandomLevel() },
          { name: "脆弱性スキャン", level: getRandomLevel() },
          { name: "コンプライアンス", level: getRandomLevel() },
          { name: "アクセス制御", level: getRandomLevel() },
          { name: "シークレット管理", level: getRandomLevel() },
          { name: "セキュアコーディング", level: getRandomLevel() }
        ]
      },
      {
        category: "品質保証",
        items: [
          { name: "自動テスト", level: getRandomLevel() },
          { name: "コード品質管理", level: getRandomLevel() },
          { name: "パフォーマンステスト", level: getRandomLevel() },
          { name: "セキュリティテスト", level: getRandomLevel() },
          { name: "UAT", level: getRandomLevel() },
          { name: "カオスエンジニアリング", level: getRandomLevel() }
        ]
      },
      {
        category: "メトリクス",
        items: [
          { name: "デプロイメント頻度", level: getRandomLevel() },
          { name: "リードタイム", level: getRandomLevel() },
          { name: "MTTR", level: getRandomLevel() },
          { name: "変更失敗率", level: getRandomLevel() },
          { name: "SLO管理", level: getRandomLevel() },
          { name: "フィードバック分析", level: getRandomLevel() }
        ]
      }
    ];

    setCapabilities(initialCapabilities);
  }, []);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleFilterChange = (level) => {
    if (level === 'clear') {
      setSelectedLevels([]);
    } else {
      setSelectedLevels(prev => 
        prev.includes(level)
          ? prev.filter(l => l !== level)
          : [...prev, level]
      );
    }
  };

  const isCardFiltered = (level) => {
    return selectedLevels.length === 0 || selectedLevels.includes(level);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">DevOps Capabilities HeatMap</h1>
      
      <div className="mb-8 sticky top-0 z-20 bg-white pt-4">
        <MaturityFilter 
          selectedLevels={selectedLevels} 
          onChange={handleFilterChange}
        />
      </div>
      
      {isWideScreen ? (
        <div className="relative mb-8">
          <ScrollButton direction="left" onClick={() => handleScroll('left')} />
          <ScrollButton direction="right" onClick={() => handleScroll('right')} />
          
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-6 gap-6 scroll-smooth scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {capabilities.map((category, idx) => (
              <Card key={idx} className="p-4 shadow-lg bg-gray-50 flex-none w-[400px]">
                <CardHeader>
                  <h2 className="text-xl font-bold mb-4 p-2 rounded-lg text-center bg-gray-700 text-white">
                    {category.category}
                  </h2>
                </CardHeader>
                <div className="grid grid-cols-2 gap-3">
                  {category.items.map((item, itemIdx) => (
                    <CapabilityCard
                      key={itemIdx}
                      name={item.name}
                      level={item.level}
                      isFiltered={isCardFiltered(item.level)}
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {capabilities.map((category, idx) => (
            <Card key={idx} className="p-4 shadow-lg bg-gray-50">
              <h2 className="text-xl font-bold mb-4 p-2 rounded-lg text-center bg-gray-700 text-white">
                {category.category}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {category.items.map((item, itemIdx) => (
                  <CapabilityCard
                    key={itemIdx}
                    name={item.name}
                    level={item.level}
                    isFiltered={isCardFiltered(item.level)}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      <MaturityLegend />
    </div>
  );
};

export default DevOpsCapabilities;
