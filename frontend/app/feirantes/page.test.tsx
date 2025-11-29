import { render, screen } from '@testing-library/react';
import LojaFeirantePage from './page';

test('deve renderizar a página do feirante', () => {
  render(<LojaFeirantePage />);
  expect(screen.getByText('Feira do Seu Zé')).toBeInTheDocument();
});