import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Resource, ResourceCategory, ResourceType } from '../types';
import { ResourceCard } from './ResourceCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  Compass,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface CatalogueViewProps {
  onSelectResource: (resource: Resource) => void;
  onOpenCreateResource: () => void;
  onOpenAIMatcher: () => void;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  onSelectResource,
  onOpenCreateResource,
  onOpenAIMatcher,
}) => {
  const { resources, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [feeFilter, setFeeFilter] = useState<string>('all');
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'capacity'>('popular');

  const categories: ResourceCategory[] = [
    'Laboratory',
    'Fabrication & 3D',
    'Media & AV',
    'Electronics & Testing',
    'Computing & AI',
    'Meeting & Workspace',
  ];

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      // Search
      const matchesSearch =
        res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.institution.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;

      // Type
      const matchesType = selectedType === 'all' || res.type === selectedType;

      // Fee
      const matchesFee = feeFilter === 'all' || res.feeType === feeFilter;

      // Eligibility
      let matchesEligible = true;
      if (onlyEligible) {
        const meetsVerification =
          !res.eligibilityRequirements.includes('verification') || currentUser.isVerified;
        const missingQuals = (res.requiredQualifications || []).filter(
          (q) => !currentUser.qualifications.includes(q)
        );
        matchesEligible = meetsVerification && missingQuals.length === 0;
      }

      return matchesSearch && matchesCategory && matchesType && matchesFee && matchesEligible;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.totalBookings - a.totalBookings;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'capacity') return b.capacity - a.capacity;
      return 0;
    });
  }, [
    resources,
    searchQuery,
    selectedCategory,
    selectedType,
    feeFilter,
    onlyEligible,
    sortBy,
    currentUser,
  ]);

  const canCreate = currentUser.role === 'owner' || currentUser.role === 'admin' || currentUser.role === 'manager';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-500" />
            Institutional Equipment & Spaces Catalogue
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover verified laboratory setups, high-precision tools, and collaborative project rooms.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAIMatcher}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Matcher</span>
          </button>

          {canCreate && (
            <button
              onClick={onOpenCreateResource}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>List New Resource</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by equipment name, keywords, specs, or laboratory..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            >
              <option value="all">All Types</option>
              <option value="equipment">Equipment</option>
              <option value="space">Space / Room</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            >
              <option value="popular">Most Booked</option>
              <option value="name">Name (A-Z)</option>
              <option value="capacity">Capacity</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Filter:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-xs transition ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyEligible}
              onChange={(e) => setOnlyEligible(e.target.checked)}
              className="rounded text-indigo-600"
            />
            <span>Show Only Eligible For Me</span>
          </label>
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 space-y-3">
          <p className="text-slate-400 text-sm">No campus resources match your filter criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedType('all');
              setOnlyEligible(false);
            }}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} onSelect={onSelectResource} />
          ))}
        </div>
      )}
    </div>
  );
};
