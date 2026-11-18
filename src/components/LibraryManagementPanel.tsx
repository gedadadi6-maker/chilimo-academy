import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, CheckCircle2, Trash2, Search, RotateCcw, AlertCircle } from 'lucide-react';
import { Language, LibraryBook, LibraryLoanRecord } from '../types';
import {
  getStoredLibraryBooks,
  saveAllLibraryBooks,
  getStoredLibraryLoans,
  saveAllLibraryLoans,
  getStoredUsers
} from '../data/mockData';

interface LibraryManagementPanelProps {
  currentLang: Language;
  onNotify?: (msg: string) => void;
}

export const LibraryManagementPanel: React.FC<LibraryManagementPanelProps> = ({
  currentLang,
  onNotify
}) => {
  const [books, setBooks] = useState<LibraryBook[]>(getStoredLibraryBooks);
  const [loans, setLoans] = useState<LibraryLoanRecord[]>(getStoredLibraryLoans);
  const [subTab, setSubTab] = useState<'loans' | 'catalog'>('loans');
  const [search, setSearch] = useState('');
  const [loanFilter, setLoanFilter] = useState<'all' | 'borrowed' | 'overdue' | 'returned'>('all');

  const students = getStoredUsers().filter((u) => u.role === 'student');

  // Issue Loan Form
  const [selectedBookId, setSelectedBookId] = useState<string>(books[0]?.id || '');
  const [loanStudentId, setLoanStudentId] = useState<string>(students[0]?.id || '151');
  const [loanDays, setLoanDays] = useState<number>(14);

  // Add Book Form
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('Afaan Oromoo & History');
  const [newGrade, setNewGrade] = useState('Grade 7–8');
  const [newIsbn, setNewIsbn] = useState('978-99944-0-105-2');
  const [newCallNumber, setNewCallNumber] = useState('CHA-LIB-108');
  const [newCopies, setNewCopies] = useState<number>(5);
  const [newLanguage, setNewLanguage] = useState('Afaan Oromoo');
  const [newSummary, setNewSummary] = useState('');

  useEffect(() => {
    const sync = () => {
      setBooks(getStoredLibraryBooks());
      setLoans(getStoredLibraryLoans());
    };
    window.addEventListener('chilimo:data-updated', sync);
    return () => window.removeEventListener('chilimo:data-updated', sync);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const enrichedLoans = loans.map((loan) => {
    if (loan.status === 'borrowed' && loan.dueDate < todayStr) {
      return { ...loan, status: 'overdue' as const };
    }
    return loan;
  });

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    const book = books.find((b) => b.id === selectedBookId);
    const student = students.find((s) => s.id === loanStudentId);
    if (!book || !student) return;
    if (book.availableCopies <= 0) {
      onNotify?.(
        currentLang === 'om'
          ? 'Kitaabni kun yeroo ammaa kuusaa keessa hin hafe!'
          : 'No available copies left for this title.'
      );
      return;
    }

    const due = new Date();
    due.setDate(due.getDate() + Math.max(1, loanDays));
    const dueStr = due.toISOString().split('T')[0];

    const newLoan: LibraryLoanRecord = {
      id: `LN-${Date.now().toString().slice(-6)}`,
      bookId: book.id,
      bookTitle: book.title,
      callNumber: book.callNumber,
      studentId: student.id,
      studentName: student.name,
      grade: student.departmentOrGrade || 'Primary',
      borrowedDate: todayStr,
      dueDate: dueStr,
      status: 'borrowed'
    };

    const updatedLoans = [newLoan, ...loans];
    const updatedBooks = books.map((b) =>
      b.id === book.id
        ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) }
        : b
    );

    saveAllLibraryLoans(updatedLoans);
    saveAllLibraryBooks(updatedBooks);
    setLoans(updatedLoans);
    setBooks(updatedBooks);
    onNotify?.(
      currentLang === 'om'
        ? `Kitaabni "${book.title}" barataa ${student.name}tti liqeeffameera!`
        : `Book issued to ${student.name}.`
    );
  };

  const handleMarkReturned = (loan: LibraryLoanRecord) => {
    const updatedLoans = loans.map((l) =>
      l.id === loan.id
        ? { ...l, status: 'returned' as const, returnedDate: todayStr }
        : l
    );
    const updatedBooks = books.map((b) =>
      b.id === loan.bookId
        ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) }
        : b
    );
    saveAllLibraryLoans(updatedLoans);
    saveAllLibraryBooks(updatedBooks);
    setLoans(updatedLoans);
    setBooks(updatedBooks);
    onNotify?.(
      currentLang === 'om'
        ? `Kitaabni "${loan.bookTitle}" deebifameera.`
        : `Returned "${loan.bookTitle}".`
    );
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) return;
    const item: LibraryBook = {
      id: `LIB-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      author: newAuthor.trim(),
      category: newCategory,
      gradeLevel: newGrade,
      isbn: newIsbn.trim(),
      callNumber: newCallNumber.trim() || 'CHA-LIB-NEW',
      coverColor: 'bg-[#0f1e36]',
      availableCopies: Math.max(1, newCopies),
      totalCopies: Math.max(1, newCopies),
      language: newLanguage,
      summary: newSummary.trim() || 'Chilimo Academy Library reference book.'
    };
    const updated = [item, ...books];
    saveAllLibraryBooks(updated);
    setBooks(updated);
    setNewTitle('');
    setNewAuthor('');
    setNewSummary('');
    onNotify?.(
      currentLang === 'om'
        ? `Kitaabni haaraan "${item.title}" kuusaa mana kitaabaatti dabalameera!`
        : `Added "${item.title}" to library catalog.`
    );
  };

  const handleDeleteBook = (bookId: string) => {
    const updated = books.filter((b) => b.id !== bookId);
    saveAllLibraryBooks(updated);
    setBooks(updated);
  };

  const totalCopies = books.reduce((sum, b) => sum + b.totalCopies, 0);
  const availableCopies = books.reduce((sum, b) => sum + b.availableCopies, 0);
  const activeLoansCount = enrichedLoans.filter((l) => l.status !== 'returned').length;
  const overdueCount = enrichedLoans.filter((l) => l.status === 'overdue').length;

  const visibleLoans = enrichedLoans.filter((l) => {
    if (loanFilter !== 'all' && l.status !== loanFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      l.bookTitle.toLowerCase().includes(q) ||
      l.studentName.toLowerCase().includes(q) ||
      l.studentId.toLowerCase().includes(q)
    );
  });

  const visibleBooks = books.filter((b) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.callNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#0f1e36] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <span>
                {currentLang === 'om'
                  ? 'Bulchiinsa Mana Kitaabaa fi Liqii Kitaabaa'
                  : 'School Library & Book Lending Ledger'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {currentLang === 'om'
                ? 'Kitaabota mana kitaabaa galmeessi, barattootaaf kenni, fi warra guyyaan irra darbe hordofi.'
                : 'Manage physical book inventory, issue student book loans, and track overdue returns.'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSubTab('loans')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                subTab === 'loans'
                  ? 'bg-[#0f1e36] text-white'
                  : 'text-slate-700 hover:text-[#0f1e36]'
              }`}
            >
              {currentLang === 'om' ? 'Liqii & Deebii Kitaabaa' : 'Loans & Returns'} ({activeLoansCount})
            </button>
            <button
              type="button"
              onClick={() => setSubTab('catalog')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                subTab === 'catalog'
                  ? 'bg-[#0f1e36] text-white'
                  : 'text-slate-700 hover:text-[#0f1e36]'
              }`}
            >
              {currentLang === 'om' ? 'Kuusaa Kitaabotaa' : 'Catalog Inventory'} ({books.length})
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-medium text-slate-500">Total Titles</div>
            <div className="text-xl font-bold text-[#0f1e36] tabular-nums mt-0.5">{books.length}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-medium text-slate-500">Available / Total Copies</div>
            <div className="text-xl font-bold text-emerald-700 tabular-nums mt-0.5">
              {availableCopies} / {totalCopies}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-medium text-slate-500">Active Loans</div>
            <div className="text-xl font-bold text-[#0f1e36] tabular-nums mt-0.5">{activeLoansCount}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <div className="text-[11px] font-medium text-rose-700">Overdue Books</div>
            <div className="text-xl font-bold text-rose-700 tabular-nums mt-0.5">{overdueCount}</div>
          </div>
        </div>

        {/* Search */}
        <div className="pt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                subTab === 'loans'
                  ? 'Search student name, ID, or book title...'
                  : 'Search title, author, or call number...'
              }
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {subTab === 'loans' && (
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'borrowed', 'overdue', 'returned'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setLoanFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer capitalize ${
                    loanFilter === st
                      ? 'bg-[#0f1e36] text-white border-[#0f1e36]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {subTab === 'loans' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Issue Book Form */}
          <form
            onSubmit={handleIssueBook}
            className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
          >
            <h3 className="font-serif font-bold text-base text-[#0f1e36] flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600" />
              <span>{currentLang === 'om' ? 'Kitaaba Barataatti Kenni' : 'Issue Book to Student'}</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Book Title</label>
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.availableCopies} avail.)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student</label>
              <select
                value={loanStudentId}
                onChange={(e) => setLoanStudentId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (ID: {s.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Loan Duration (Days)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={loanDays}
                onChange={(e) => setLoanDays(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono tabular-nums"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0f1e36] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              {currentLang === 'om' ? 'Liqii Galmeessi (Issue Book)' : 'Confirm Book Loan'}
            </button>
          </form>

          {/* Loans Table */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Student</th>
                    <th className="py-3 px-4 font-semibold">Book &amp; Call #</th>
                    <th className="py-3 px-4 font-semibold">Due Date</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0f1e36]">{loan.studentName}</div>
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          ID: {loan.studentId} · {loan.grade}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{loan.bookTitle}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{loan.callNumber}</div>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                        <div>{loan.dueDate}</div>
                        <div className="text-[11px] text-slate-400">Out: {loan.borrowedDate}</div>
                      </td>
                      <td className="py-3 px-4">
                        {loan.status === 'returned' && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Returned
                          </span>
                        )}
                        {loan.status === 'overdue' && (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
                            <AlertCircle className="w-3.5 h-3.5" /> Overdue
                          </span>
                        )}
                        {loan.status === 'borrowed' && (
                          <span className="text-amber-700 font-semibold">Borrowed</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {loan.status !== 'returned' ? (
                          <button
                            type="button"
                            onClick={() => handleMarkReturned(loan)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer whitespace-nowrap"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Return</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">{loan.returnedDate}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {visibleLoans.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No loan records match the current filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Add Book Form */}
          <form
            onSubmit={handleAddBook}
            className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3"
          >
            <h3 className="font-serif font-bold text-base text-[#0f1e36] flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600" />
              <span>{currentLang === 'om' ? 'Kitaaba Haaraa Dabali' : 'Add Library Book'}</span>
            </h3>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Book Title"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
            <input
              type="text"
              required
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="Author / Publisher"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                placeholder="Grade Level"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
              <select
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="Afaan Oromoo">Afaan Oromoo</option>
                <option value="English">English</option>
                <option value="Amharic">Amharic</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newCallNumber}
                onChange={(e) => setNewCallNumber(e.target.value)}
                placeholder="Call Number"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
              />
              <input
                type="number"
                min={1}
                value={newCopies}
                onChange={(e) => setNewCopies(Number(e.target.value))}
                placeholder="Total Copies"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono tabular-nums"
              />
            </div>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
            <input
              type="text"
              value={newIsbn}
              onChange={(e) => setNewIsbn(e.target.value)}
              placeholder="ISBN"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
            />
            <textarea
              rows={2}
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              placeholder="Short description..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-[#0f1e36] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              {currentLang === 'om' ? 'Kuusaa Kitaabaatti Dabali' : 'Save Book to Catalog'}
            </button>
          </form>

          {/* Catalog Table */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Book Title &amp; Author</th>
                    <th className="py-3 px-4 font-semibold">Grade / Lang</th>
                    <th className="py-3 px-4 font-semibold">Call # / ISBN</th>
                    <th className="py-3 px-4 font-semibold">Copies</th>
                    <th className="py-3 px-4 font-semibold text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0f1e36]">{book.title}</div>
                        <div className="text-[11px] text-slate-500">{book.author}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div>{book.gradeLevel}</div>
                        <div className="text-[11px] text-slate-400">{book.language}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        <div>{book.callNumber}</div>
                        <div className="text-slate-400">{book.isbn}</div>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums font-semibold text-[#0f1e36]">
                        {book.availableCopies} / {book.totalCopies}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteBook(book.id)}
                          aria-label={`Remove ${book.title}`}
                          className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
