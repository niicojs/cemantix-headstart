import path from 'node:path';
import { parseArgs } from 'node:util';
import { readFileSync } from 'fs';
import { parse as parseToml } from 'smol-toml';
import { existsSync } from 'node:fs';

export default function getConfig() {
  const { values } = parseArgs({
    options: {
      home: { type: 'string', default: '.' },
    },
  });

  let config = { home: values.home };

  const configFile = path.join(values.home, 'config.toml');
  if (existsSync(configFile)) {
    config = {
      ...config,
      ...parseToml(readFileSync(configFile, 'utf-8')),
    };
  }

  return config;
}
