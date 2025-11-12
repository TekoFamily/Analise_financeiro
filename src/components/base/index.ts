/**
 * src/components/base/index.ts
 * 📦 Barrel Export - Componentes Base
 *
 * Facilita a importação de múltiplos componentes base em um único import.
 *
 * Uso:
 * import { Button, Input, Card, Heading, Body } from '@components/base';
 *
 * Ao invés de:
 * import { Button } from '@components/base/Button';
 * import { Input } from '@components/base/Input';
 * import { Card } from '@components/base/Card';
 */

// Componentes de UI base
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';

// Componentes de tipografia
export { Heading, Body, Caption } from './Typography';
