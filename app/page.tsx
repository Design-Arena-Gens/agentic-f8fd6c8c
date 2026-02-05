'use client'

import { useState, useEffect } from 'react'

interface Expense {
  id: string
  date: string
  description: string
  amount: number
  category: string
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [filterCategory, setFilterCategory] = useState('All')

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other']

  useEffect(() => {
    const saved = localStorage.getItem('expenses')
    if (saved) {
      setExpenses(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault()

    if (!description || !amount) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description,
      amount: parseFloat(amount),
      category
    }

    setExpenses([newExpense, ...expenses])
    setDescription('')
    setAmount('')
    setCategory('Food')
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id))
  }

  const filteredExpenses = filterCategory === 'All'
    ? expenses
    : expenses.filter(exp => exp.category === filterCategory)

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="container">
      <header className="header">
        <h1>💰 Expense Tracker</h1>
        <p>Track your daily expenses effortlessly</p>
      </header>

      <div className="dashboard">
        <div className="card summary-card total">
          <h2>Total Expenses</h2>
          <div className="amount">${totalExpenses.toFixed(2)}</div>
          <p>{filterCategory !== 'All' ? `in ${filterCategory}` : 'across all categories'}</p>
        </div>

        <div className="card summary-card count">
          <h2>Total Transactions</h2>
          <div className="amount">{filteredExpenses.length}</div>
          <p>{filterCategory !== 'All' ? `in ${filterCategory}` : 'across all categories'}</p>
        </div>
      </div>

      <div className="card form-card">
        <h2>Add New Expense</h2>
        <form onSubmit={addExpense} className="expense-form">
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Lunch at cafe"
              required
            />
          </div>

          <div className="form-group">
            <label>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Add Expense
          </button>
        </form>
      </div>

      <div className="card expenses-card">
        <h2>Recent Expenses</h2>

        <div className="filter-section">
          <label>Filter by category:</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses yet</p>
            <span style={{ fontSize: '3rem' }}>📊</span>
          </div>
        ) : (
          <div className="expenses-list">
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="expense-item">
                <div className="expense-date">{expense.date}</div>
                <div className="expense-description">{expense.description}</div>
                <div className="expense-category">{expense.category}</div>
                <div className="expense-amount">${expense.amount.toFixed(2)}</div>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
