/**
 * Table Manager Module
 * Handles data table functionality including sorting, pagination, filtering, and rendering
 */

class TableManager {
  constructor() {
    this.currentCountry = 'usa';
    this.currentCategory = 'All Categories';
    this.currentPage = 1;
    this.rowsPerPage = 20;
    this.totalPages = 1;
    this.currentSort = {
      key: 'Total Referral Traffic',
      direction: 'desc'
    };
    
    this.init();
  }

  /**
   * Initialize the table manager
   */
  init() {
    this.bindEvents();
    this.initializeDropdown();
    this.showTable('usa');
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Country button events
    const countryButtons = document.querySelectorAll('.country-btn');
    countryButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const country = e.currentTarget.dataset.country;
        this.showTable(country);
      });
    });

    // Category dropdown events
    this.bindDropdownEvents();
  }

  /**
   * Bind dropdown events
   */
  bindDropdownEvents() {
    const dropdownBtn = document.getElementById('category-dropdown-btn');
    const dropdownList = document.getElementById('category-dropdown-list');

    if (!dropdownBtn || !dropdownList) return;

    // Toggle dropdown
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownList.classList.toggle('hidden');
      dropdownBtn.setAttribute('aria-expanded', !dropdownList.classList.contains('hidden'));
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdownBtn.contains(e.target) && !dropdownList.contains(e.target)) {
        dropdownList.classList.add('hidden');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Keyboard accessibility
    dropdownBtn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dropdownList.classList.remove('hidden');
        dropdownBtn.setAttribute('aria-expanded', 'true');
        const firstOption = dropdownList.querySelector('li');
        if (firstOption) firstOption.focus();
      }
    });
  }

  /**
   * Initialize category dropdown with data
   */
  initializeDropdown() {
    const data = this.currentCountry === 'usa' ? usaTableData : indiaTableData;
    this.populateDropdown(data);
  }

  /**
   * Populate category dropdown with unique categories
   */
  populateDropdown(data) {
    const dropdownList = document.getElementById('category-dropdown-list');
    const dropdownLabel = document.getElementById('category-dropdown-label');
    
    if (!dropdownList || !dropdownLabel) return;

    const categories = this.getUniqueCategories(data);
    dropdownList.innerHTML = '';

    ['All Categories', ...categories].forEach(category => {
      const li = document.createElement('li');
      li.textContent = category;
      li.tabIndex = 0;
      li.className = 'px-4 py-2 cursor-pointer rounded-md hover:bg-blue-100 focus:bg-blue-100 text-blue-700 whitespace-nowrap transition-all';
      li.setAttribute('role', 'option');
      
      li.addEventListener('click', () => {
        this.currentCategory = category;
        dropdownLabel.textContent = category;
        dropdownList.classList.add('hidden');
        this.currentPage = 1;
        this.renderTable();
      });

      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          li.click();
        }
      });

      dropdownList.appendChild(li);
    });
  }

  /**
   * Get unique categories from data
   */
  getUniqueCategories(data) {
    const categories = new Set();
    data.forEach(item => {
      const cat = item["Category "] && item["Category "].trim();
      if (cat) categories.add(cat);
    });
    return Array.from(categories).sort();
  }

  /**
   * Show table for specific country
   */
  showTable(country) {
    // Update button states
    this.updateCountryButtons(country);
    
    // Update current country and reset filters
    this.currentCountry = country;
    this.currentCategory = 'All Categories';
    this.currentPage = 1;
    
    // Update dropdown label
    const dropdownLabel = document.getElementById('category-dropdown-label');
    if (dropdownLabel) dropdownLabel.textContent = 'All Categories';
    
    // Update dropdown options and render table
    this.initializeDropdown();
    this.renderTable();
    
    // Show/hide appropriate table containers
    this.toggleTableVisibility(country);
  }

  /**
   * Update country button states
   */
  updateCountryButtons(activeCountry) {
    const buttons = document.querySelectorAll('.country-btn');
    buttons.forEach(btn => {
      const country = btn.dataset.country;
      if (country === activeCountry) {
        btn.className = btn.className.replace(/border border-gray-300 text-gray-700/, '');
        btn.classList.add('bg-[#e6e0ff]', 'text-[#5b3fee]', 'shadow-sm');
      } else {
        btn.className = btn.className.replace(/bg-\[#e6e0ff\] text-\[#5b3fee\] shadow-sm/, '');
        btn.classList.add('border', 'border-gray-300', 'text-gray-700');
      }
    });
  }

  /**
   * Toggle table visibility
   */
  toggleTableVisibility(activeCountry) {
    const usaTable = document.getElementById('usa-table');
    const indiaTable = document.getElementById('india-table');
    
    if (activeCountry === 'usa') {
      usaTable?.classList.remove('hidden');
      indiaTable?.classList.add('hidden');
    } else {
      usaTable?.classList.add('hidden');
      indiaTable?.classList.remove('hidden');
    }
  }

  /**
   * Render the complete table
   */
  renderTable() {
    try {
      const data = this.currentCountry === 'usa' ? usaTableData : indiaTableData;
      const filteredData = this.filterData(data);
      const sortedData = this.sortData(filteredData);
      
      this.renderTableHeader();
      this.renderTableBody(sortedData);
      this.renderMobileCards(sortedData);
      this.renderPagination(sortedData.length);
    } catch (error) {
      console.error('Error rendering table:', error);
      this.showErrorMessage();
    }
  }

  /**
   * Filter data by category
   */
  filterData(data) {
    if (this.currentCategory === 'All Categories') {
      return data;
    }
    return data.filter(item => item["Category "] === this.currentCategory);
  }

  /**
   * Sort data by current sort criteria
   */
  sortData(data) {
    if (!this.currentSort.key) return data;
    
    return [...data].sort((a, b) => {
      const aVal = this.getNumericValue(a[this.currentSort.key]);
      const bVal = this.getNumericValue(b[this.currentSort.key]);
      
      if (this.currentSort.direction === 'asc') {
        return aVal - bVal;
      } else {
        return bVal - aVal;
      }
    });
  }

  /**
   * Get numeric value for sorting
   */
  getNumericValue(val) {
    if (!val) return 0;
    return Number(String(val).replace(/,/g, '').replace(/\s/g, '').trim()) || 0;
  }

  /**
   * Render table header with sorting
   */
  renderTableHeader() {
    const tableId = this.currentCountry === 'usa' ? 'usa-table-header' : 'india-table-header';
    const header = document.getElementById(tableId);
    
    if (!header) return;

    const sortArrow = (colKey) => {
      if (this.currentSort.key !== colKey) {
        return '<span class="ml-1 text-gray-400">⇅</span>';
      }
      return this.currentSort.direction === 'asc'
        ? '<span class="ml-1 text-blue-600">↑</span>'
        : '<span class="ml-1 text-blue-600">↓</span>';
    };

    header.innerHTML = `
      <tr class="text-[#204085]">
        <th class="px-4 py-3 font-medium text-[14px] hidden md:table-cell">S.No</th>
        <th class="px-4 py-3 font-medium text-[14px]">Domain</th>
        <th class="px-4 py-3 font-medium text-[12px]">Category</th>
        <th class="px-4 py-3 font-medium text-[14px] cursor-pointer sort-header" data-sort-key="Total Referral Traffic">
          Total Referral Traffic${sortArrow('Total Referral Traffic')}
        </th>
        <th class="px-4 py-3 font-medium text-[14px] cursor-pointer sort-header" data-sort-key="LLM's Referral Traffic">
          LLM's Referral Traffic${sortArrow("LLM's Referral Traffic")}
        </th>
        <th class="px-4 py-3 font-medium text-[14px] cursor-pointer sort-header" data-sort-key="Total OrganicTraffic ">
          Total Organic Traffic${sortArrow('Total OrganicTraffic ')}
        </th>
        <th class="px-4 py-3 font-medium text-[14px] cursor-pointer sort-header" data-sort-key=" AIO Traffic">
          AIO Traffic${sortArrow(' AIO Traffic')}
        </th>
      </tr>
    `;

    // Bind sort events
    header.querySelectorAll('.sort-header').forEach(th => {
      th.addEventListener('click', () => {
        const sortKey = th.getAttribute('data-sort-key');
        if (this.currentSort.key === sortKey) {
          this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
          this.currentSort.key = sortKey;
          this.currentSort.direction = 'desc';
        }
        this.currentPage = 1;
        this.renderTable();
      });
    });
  }

  /**
   * Render table body with pagination
   */
  renderTableBody(sortedData) {
    const tableBodyId = this.currentCountry === 'usa' ? 'usa-table-body' : 'india-table-body';
    const tableBody = document.getElementById(tableBodyId);
    
    if (!tableBody) return;

    tableBody.innerHTML = '';

    // Calculate pagination
    this.totalPages = Math.ceil(sortedData.length / this.rowsPerPage);
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;
    
    const startIdx = (this.currentPage - 1) * this.rowsPerPage;
    const endIdx = startIdx + this.rowsPerPage;
    const paginatedData = sortedData.slice(startIdx, endIdx);

    if (paginatedData.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td colspan="7" class="px-4 py-8 text-center text-gray-500">
          No results found for this category.
        </td>
      `;
      tableBody.appendChild(row);
      return;
    }

    const locale = this.currentCountry === 'usa' ? 'en-US' : 'en-IN';

    paginatedData.forEach((item, index) => {
      const row = document.createElement('tr');
      const bgColorClass = this.getRowBackgroundClass(index);
      
      row.className = `${bgColorClass} rounded-md overflow-hidden`;
      row.innerHTML = `
        <td class="px-4 py-4 text-sm hidden md:table-cell rounded-l-[8px]">
          ${startIdx + index + 1}
        </td>
        <td class="px-4 py-4 text-sm">
          <a href="https://${item.Domain}" target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center gap-1 text-[#204085] hover:text-blue-600 transition">
            ${item.Domain}
          </a>
        </td>
        <td class="px-4 py-4 text-[12px]">
          ${item["Category "] || ""}
        </td>
        <td class="px-4 py-4 text-[14px]">
          ${this.formatNumber(item["Total Referral Traffic"], locale)}
        </td>
        <td class="px-4 py-4 text-[14px]">
          ${this.formatNumber(item["LLM's Referral Traffic"], locale)}
        </td>
        <td class="px-4 py-4 text-[14px]">
          ${this.formatNumber(item["Total OrganicTraffic "], locale)}
        </td>
        <td class="px-4 py-4 rounded-r-[8px]">
          ${this.formatNumber(item[" AIO Traffic"], locale)}
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  /**
   * Render mobile cards
   */
  renderMobileCards(sortedData) {
    const containerId = this.currentCountry === 'usa' ? 'usa-mobile-cards' : 'india-mobile-cards';
    const container = document.getElementById(containerId);
    
    if (!container) return;

    container.innerHTML = '';

    const startIdx = (this.currentPage - 1) * this.rowsPerPage;
    const endIdx = startIdx + this.rowsPerPage;
    const paginatedData = sortedData.slice(startIdx, endIdx);
    const locale = this.currentCountry === 'usa' ? 'en-US' : 'en-IN';

    paginatedData.forEach((item, index) => {
      const card = document.createElement('div');
      const bgColorClass = this.getRowBackgroundClass(index);
      
      card.className = `mobile-card ${bgColorClass} rounded-lg shadow-sm p-4 mb-4`;
      card.innerHTML = `
        <div class="flex justify-between items-start mb-3">
          <div>
            <div class="font-semibold text-[#204085] text-sm">${item.Domain}</div>
            <div class="text-xs text-gray-600">${item["Category "]}</div>
          </div>
          <div class="text-xs text-gray-500">#${startIdx + index + 1}</div>
        </div>
        
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-xs text-gray-600">Total Referral Traffic</span>
            <span class="text-xs font-medium">${this.formatNumber(item["Total Referral Traffic"], locale)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-gray-600">LLM's Referral Traffic</span>
            <span class="text-xs font-medium">${this.formatNumber(item["LLM's Referral Traffic"], locale)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-gray-600">Total Organic Traffic</span>
            <span class="text-xs font-medium">${this.formatNumber(item["Total OrganicTraffic "], locale)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-gray-600">AIO Traffic</span>
            <span class="text-xs font-medium">${this.formatNumber(item[" AIO Traffic"], locale)}</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  /**
   * Get row background class based on index
   */
  getRowBackgroundClass(index) {
    if (index === 0) return "bg-[#EAFFF2]";
    if (index === 1) return "bg-[#FCFFEA]";
    if (index === 2) return "bg-[#FFFCF7]";
    return "bg-white";
  }

  /**
   * Render pagination controls
   */
  renderPagination(dataLength) {
    const tableContainer = document.getElementById(this.currentCountry === 'usa' ? 'usa-table' : 'india-table');
    if (!tableContainer) return;

    let pagination = tableContainer.querySelector('.pagination-controls');
    if (!pagination) {
      pagination = document.createElement('div');
      pagination.className = 'pagination-controls flex justify-end items-center gap-2 mt-4';
      tableContainer.appendChild(pagination);
    }

    pagination.innerHTML = '';
    this.totalPages = Math.ceil(dataLength / this.rowsPerPage);

    if (this.totalPages <= 1) {
      pagination.style.display = 'none';
      return;
    }

    pagination.style.display = 'flex';

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.textContent = 'Previous';
    prevBtn.className = 'px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 transition';
    prevBtn.disabled = this.currentPage === 1;
    prevBtn.onclick = () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderTable();
      }
    };
    pagination.appendChild(prevBtn);

    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
    pageInfo.className = 'mx-2 text-gray-600';
    pagination.appendChild(pageInfo);

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.textContent = 'Next';
    nextBtn.className = 'px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 transition';
    nextBtn.disabled = this.currentPage === this.totalPages;
    nextBtn.onclick = () => {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.renderTable();
      }
    };
    pagination.appendChild(nextBtn);
  }

  /**
   * Format number with locale
   */
  formatNumber(value, locale) {
    if (!value) return "";
    const num = Number(String(value).replace(/,/g, '').trim());
    if (isNaN(num)) return value;
    return num.toLocaleString(locale);
  }

  /**
   * Show error message
   */
  showErrorMessage() {
    const tableBodyId = this.currentCountry === 'usa' ? 'usa-table-body' : 'india-table-body';
    const tableBody = document.getElementById(tableBodyId);
    
    if (!tableBody) return;

    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="px-4 py-8 text-center text-red-500">
          Error loading data. Please try again.
        </td>
      </tr>
    `;
  }
}

// Initialize table manager when DOM is loaded
let tableManager;
document.addEventListener('DOMContentLoaded', () => {
  tableManager = new TableManager();
});