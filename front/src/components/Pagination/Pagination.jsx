import '../../styles/pagination.scss';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        className={i === currentPage ? 'active' : ''}
        onClick={() => onPageChange(i)}>
        {i}
      </button>
    );
  }

  return (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        Anterior
      </button>
      {pages}
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Próximo
      </button>
    </div>
  );
}
