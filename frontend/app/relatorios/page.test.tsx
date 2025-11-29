import { render, screen, fireEvent } from '@testing-library/react';
import RelatoriosPage from './page';
import '@testing-library/jest-dom';

// Mock do window.confirm para testes
beforeEach(() => {
  window.confirm = jest.fn(() => true);
});

// Teste 1: Verifica se a página renderiza
test('deve renderizar a página de relatórios', () => {
  render(<RelatoriosPage />);
  expect(screen.getByText('Relatórios Administrativos')).toBeInTheDocument();
});

// Teste 2: Verifica estatísticas gerais
test('deve exibir estatísticas corretas', () => {
  render(<RelatoriosPage />);
  
  // Verifica se as principais seções estão presentes (usando getAllByText para elementos duplicados)
  expect(screen.getAllByText('Usuários').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Feirantes').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Administradores').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Buscas Realizadas').length).toBeGreaterThan(0);
});