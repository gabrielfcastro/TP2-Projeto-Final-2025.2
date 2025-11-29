import { render, screen } from '@testing-library/react';
import LojaFeirantePage from './page';

test('deve renderizar a página do feirante', () => {
  render(<LojaFeirantePage />);
  expect(screen.getByText('Feira do Seu Zé')).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import LojaFeirantePage from './page';

import { render, screen } from '@testing-library/react';
import LojaFeirantePage from './page';

test('deve exibir informações completas do feirante', () => {
  render(<LojaFeirantePage />);
  
  expect(screen.getByText('Feira do Seu Zé')).toBeInTheDocument();
  expect(screen.getByText('2.5 km de você')).toBeInTheDocument();
  expect(screen.getByText('Produtos frescos direto da roça')).toBeInTheDocument();
  expect(screen.getByText(/Barraca 15/)).toBeInTheDocument(); // Regex para parte do texto
  expect(screen.getByText(/\(11\) 99999-9999/)).toBeInTheDocument(); // Regex para telefone
});