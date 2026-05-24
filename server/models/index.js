import { getDatabase } from '../database/init.js';
import bcrypt from 'bcrypt';

const promisify = (fn) => {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
};

export class User {
  static findByEmail(email) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static findById(id) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.get('SELECT id, name, email, created_at FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static create(name, email, password) {
    const db = getDatabase();
    const hashedPassword = bcrypt.hashSync(password, 10);
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, name, email });
        }
      );
    });
  }

  static verifyPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
  }
}

export class Lead {
  static getAll(filters = {}) {
    const db = getDatabase();
    let query = 'SELECT * FROM leads';
    const params = [];
    const conditions = [];

    if (filters.status) {
      conditions.push('status = ?');
      params.push(filters.status);
    }

    if (filters.search) {
      conditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    return new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  static getById(id) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM leads WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static create(leadData) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO leads (name, email, phone, company, source, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          leadData.name,
          leadData.email,
          leadData.phone || null,
          leadData.company || null,
          leadData.source || null,
          leadData.status || 'New',
          leadData.notes || null
        ],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...leadData });
        }
      );
    });
  }

  static update(id, leadData) {
    const db = getDatabase();
    const updates = [];
    const values = [];

    if (leadData.name !== undefined) {
      updates.push('name = ?');
      values.push(leadData.name);
    }
    if (leadData.email !== undefined) {
      updates.push('email = ?');
      values.push(leadData.email);
    }
    if (leadData.phone !== undefined) {
      updates.push('phone = ?');
      values.push(leadData.phone);
    }
    if (leadData.company !== undefined) {
      updates.push('company = ?');
      values.push(leadData.company);
    }
    if (leadData.source !== undefined) {
      updates.push('source = ?');
      values.push(leadData.source);
    }
    if (leadData.status !== undefined) {
      updates.push('status = ?');
      values.push(leadData.status);
    }
    if (leadData.notes !== undefined) {
      updates.push('notes = ?');
      values.push(leadData.notes);
    }

    if (updates.length === 0) return Promise.resolve(null);

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE leads SET ${updates.join(', ')} WHERE id = ?`;
    
    return new Promise((resolve, reject) => {
      db.run(query, values, (err) => {
        if (err) {
          reject(err);
        } else {
          Lead.getById(id).then(resolve).catch(reject);
        }
      });
    });
  }

  static delete(id) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM leads WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve({ success: true });
      });
    });
  }

  static getStats() {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      const stats = {};
      
      db.get('SELECT COUNT(*) as count FROM leads', (err, row) => {
        if (err) return reject(err);
        stats.total = row.count;
        
        db.get('SELECT COUNT(*) as count FROM leads WHERE status = "New"', (err, row) => {
          if (err) return reject(err);
          stats.new = row.count;
          
          db.get('SELECT COUNT(*) as count FROM leads WHERE status = "Contacted"', (err, row) => {
            if (err) return reject(err);
            stats.contacted = row.count;
            
            db.get('SELECT COUNT(*) as count FROM leads WHERE status = "Converted"', (err, row) => {
              if (err) return reject(err);
              stats.converted = row.count;
              
              db.get('SELECT COUNT(*) as count FROM leads WHERE status = "Rejected"', (err, row) => {
                if (err) return reject(err);
                stats.rejected = row.count;
                resolve(stats);
              });
            });
          });
        });
      });
    });
  }
}
