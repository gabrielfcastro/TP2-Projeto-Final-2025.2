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