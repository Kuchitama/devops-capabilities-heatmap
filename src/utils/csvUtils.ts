export const parseCapabilityCsv = async (file: File): Promise<Record<string, number>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const lines = csvText.split('\n');
        
        // ヘッダー行をスキップ
        const data: Record<string, number> = {};
        
        lines.slice(1).forEach(line => {
          const [name, levelStr] = line.trim().split(',');
          if (name && levelStr) {
            const level = parseInt(levelStr, 10);
            if (!isNaN(level) && level >= 1 && level <= 4) {
              data[name] = level;
            }
          }
        });
        
        resolve(data);
      } catch (error) {
        reject(new Error('CSVファイルの解析に失敗しました'));
      }
    };
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
    reader.readAsText(file);
  });
};

export const validateCapabilityData = (data: Record<string, number>): boolean => {
  return Object.values(data).every(level => 
    Number.isInteger(level) && level >= 1 && level <= 4
  );
};
