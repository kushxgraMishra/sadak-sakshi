import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Blocks,
  ChevronDown,
  CircleCheck,
  ClipboardCheck,
  FileCheck2,
  FileText,
  LayoutDashboard,
  MapPin,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react';

type ProjectStatus = 'On track' | 'Needs review' | 'At risk';
type Project = {
  id: string;
  name: string;
  location: string;
  status: ProjectStatus;
  progress: number;
  budget: string;
  updated: string;
  color: string;
};

type ActivityItem = {
  title: string;
  detail: string;
  time: string;
  icon: typeof FileCheck2;
  tone: 'teal' | 'amber' | 'blue';
};

const projects: Project[] = [
  { id: 'nh44', name: 'NH-44 Road Improvement', location: 'Jaipur, Rajasthan', status: 'On track', progress: 72, budget: '₹48.2 Cr', updated: '12 min ago', color: '#27d3c2' },
  { id: 'ring', name: 'Western Ring Road', location: 'Indore, Madhya Pradesh', status: 'Needs review', progress: 48, budget: '₹31.8 Cr', updated: '1 hr ago', color: '#ffb22e' },
  { id: 'bridge', name: 'Narmada Bridge Approach', location: 'Bharuch, Gujarat', status: 'At risk', progress: 26, budget: '₹19.6 Cr', updated: '3 hrs ago', color: '#ff625c' },
];

const activities: ActivityItem[] = [
  { title: 'Material batch verified', detail: 'NH-44 · Batch #MAT-2048', time: '12 min ago', icon: BadgeCheck, tone: 'teal' },
  { title: 'Inspection record added', detail: 'Western Ring Road · Section B', time: '1 hr ago', icon: ClipboardCheck, tone: 'amber' },
  { title: 'Liability window opened', detail: 'Narmada Bridge Approach', time: '3 hrs ago', icon: ShieldCheck, tone: 'blue' },
  { title: 'New defect reported', detail: 'NH-44 · Chainage 102+400', time: 'Yesterday', icon: Wrench, tone: 'amber' },
];

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Projects', icon: Blocks },
  { label: 'Evidence registry', icon: FileCheck2 },
  { label: 'Defect reports', icon: Wrench },
  { label: 'Verification', icon: ShieldCheck },
];

function PixelMark({ small = false }: { small?: boolean }) {
  return (
    <div className={small ? 'pixel-mark small' : 'pixel-mark'} aria-hidden="true">
      <i /><i /><i /><i /><i /><i /><i /><i /><i />
    </div>
  );
}

function App() {
  const [activeNav, setActiveNav] = useState('Overview');
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [query, setQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState('');

  const filteredProjects = useMemo(() => projects.filter((project) => `${project.name} ${project.location}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const selectProject = (project: Project) => {
    setSelectedProject(project);
    setToast(`${project.name} is now active`);
    window.setTimeout(() => setToast(''), 2600);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <PixelMark />
          <div>
            <div className="brand-name">SADAK<br />SAKSHI</div>
            <div className="brand-sub">THE ROAD THAT CANNOT BE CHEATED</div>
          </div>
        </div>

        <div className="workspace-switcher">
          <div className="workspace-avatar">SS</div>
          <div><span>Workspace</span><strong>Public Works Lab</strong></div>
          <ChevronDown size={15} />
        </div>

        <nav className="side-nav" aria-label="Primary navigation">
          <div className="nav-label">CONTROL ROOM</div>
          {navItems.map(({ label, icon: Icon }) => (
            <button className={`nav-item ${activeNav === label ? 'active' : ''}`} key={label} onClick={() => setActiveNav(label)}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'Defect reports' && <b>3</b>}
            </button>
          ))}
          <div className="nav-label secondary-label">SYSTEM</div>
          <button className="nav-item" onClick={() => setToast('Settings are coming in the next release')}><SlidersHorizontal size={17} /><span>Settings</span></button>
        </nav>

        <div className="sidebar-footer">
          <div className="network-status"><span className="status-dot" />All systems operational</div>
          <div className="sidebar-meta"><span>Network</span><strong>Polygon Amoy</strong></div>
          <div className="sidebar-meta"><span>Registry sync</span><strong>Block #18,942,304</strong></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open menu"><Menu size={20} /></button>
          <div className="breadcrumbs"><span>Sadak Sakshi</span><i>/</i><strong>{activeNav}</strong></div>
          <div className="topbar-actions">
            <div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, records..." /><kbd>⌘ K</kbd></div>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setShowNotifications(!showNotifications)}><Bell size={18} /><span /></button>
            <div className="user-pill"><div className="user-avatar">AK</div><div className="user-info"><strong>Arjun Kapoor</strong><span>Administrator</span></div><ChevronDown size={15} /></div>
          </div>
          {showNotifications && <div className="notification-popover"><div className="popover-heading"><strong>Notifications</strong><span>3 unread</span></div><p><span className="notification-dot teal-dot" />Material batch #MAT-2048 was verified.</p><p><span className="notification-dot amber-dot" />A new defect report needs review.</p><button onClick={() => setShowNotifications(false)}>Mark all as read</button></div>}
        </header>

        <div className="page-wrap">
          <section className="hero-row">
            <div><div className="eyebrow"><span className="eyebrow-line" />01 / OVERVIEW</div><h1>Good morning, Arjun<span className="accent-dot">.</span></h1><p className="hero-copy">A living record of every public road.<br />From tender to liability, nothing gets lost.</p></div>
            <div className="hero-actions"><button className="button secondary" onClick={() => setToast('Export prepared for download')}><ArrowUpRight size={16} />Export report</button><button className="button primary" onClick={() => setShowCreate(true)}><Plus size={17} />Register project</button></div>
          </section>

          <section className="stats-grid">
            <div className="stat-card stat-card-highlight"><div className="stat-top"><span>ACTIVE PROJECTS</span><Blocks size={17} /></div><strong>24</strong><div className="stat-bottom"><span className="trend positive">+4.8%</span><span>vs last quarter</span></div><div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
            <div className="stat-card"><div className="stat-top"><span>EVIDENCE RECORDS</span><FileText size={17} /></div><strong>1,284</strong><div className="stat-bottom"><span className="trend positive">+18.2%</span><span>this month</span></div><div className="sparkline teal-spark"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
            <div className="stat-card"><div className="stat-top"><span>VERIFICATION RATE</span><CircleCheck size={17} /></div><strong>96.8<span className="stat-unit">%</span></strong><div className="stat-bottom"><span className="trend positive">+2.1%</span><span>vs last month</span></div><div className="ring-progress"><div><strong>96</strong><span>/ 100</span></div></div></div>
            <div className="stat-card"><div className="stat-top"><span>OPEN DEFECTS</span><Wrench size={17} /></div><strong>08</strong><div className="stat-bottom"><span className="trend negative">-12.5%</span><span>vs last month</span></div><div className="defect-track"><span style={{ width: '30%' }} /></div><small>2 critical · 6 monitoring</small></div>
          </section>

          <section className="content-grid">
            <div className="panel projects-panel">
              <div className="panel-heading"><div><div className="eyebrow compact"><span className="eyebrow-line" />PROJECT REGISTRY</div><h2>Recent projects</h2></div><button className="text-button" onClick={() => setActiveNav('Projects')}>View all <ArrowUpRight size={14} /></button></div>
              <div className="project-table-head"><span>PROJECT</span><span>STATUS</span><span>PROGRESS</span><span>LAST UPDATED</span><span /></div>
              <div className="project-list">{filteredProjects.map((project) => <button className={`project-row ${selectedProject.id === project.id ? 'selected' : ''}`} key={project.id} onClick={() => selectProject(project)}><div className="project-name"><span className="project-icon" style={{ background: `${project.color}18`, color: project.color }}><MapPin size={16} /></span><span><strong>{project.name}</strong><small>{project.location}</small></span></div><span className={`status-pill ${project.status.toLowerCase().replace(' ', '-')}`}><i />{project.status}</span><div className="progress-cell"><div className="progress-bar"><span style={{ width: `${project.progress}%`, background: project.color }} /></div><small>{project.progress}%</small></div><span className="updated-cell">{project.updated}</span><ArrowUpRight size={16} className="row-arrow" /></button>)}{filteredProjects.length === 0 && <div className="empty-state">No projects match “{query}”.</div>}</div>
              <div className="table-footer"><span>Showing {filteredProjects.length} of 24 projects</span><span className="live-sync"><i />Live registry</span></div>
            </div>

            <div className="panel activity-panel">
              <div className="panel-heading"><div><div className="eyebrow compact"><span className="eyebrow-line" />LIVE FEED</div><h2>Latest activity</h2></div><button className="icon-button"><Activity size={17} /></button></div>
              <div className="activity-list">{activities.map(({ title, detail, time, icon: Icon, tone }) => <div className="activity-item" key={title}><div className={`activity-icon ${tone}`}><Icon size={16} /></div><div className="activity-copy"><strong>{title}</strong><span>{detail}</span></div><time>{time}</time></div>)}</div>
              <button className="activity-footer" onClick={() => setActiveNav('Evidence registry')}>Open activity log <ArrowUpRight size={14} /></button>
            </div>
          </section>

          <section className="bottom-grid">
            <div className="panel journey-panel"><div className="panel-heading"><div><div className="eyebrow compact"><span className="eyebrow-line" />ACCOUNTABILITY LOOP</div><h2>One record. Every handover.</h2></div><Sparkles size={18} color="#ffb22e" /></div><div className="journey-line"><div className="journey-progress" /><div className="journey-step complete"><span><CircleCheck size={16} /></span><strong>Register</strong><small>Project created</small></div><div className="journey-step complete"><span><CircleCheck size={16} /></span><strong>Anchor</strong><small>Evidence attached</small></div><div className="journey-step current"><span>03</span><strong>Verify</strong><small>2 actions due</small></div><div className="journey-step"><span>04</span><strong>Settle</strong><small>On completion</small></div></div></div>
            <div className="panel selected-panel"><div className="selected-label">SELECTED PROJECT</div><div className="selected-title"><div className="selected-project-mark" style={{ background: `${selectedProject.color}18`, color: selectedProject.color }}><MapPin size={19} /></div><div><h3>{selectedProject.name}</h3><span>{selectedProject.location}</span></div></div><div className="selected-meta"><div><span>Contract value</span><strong>{selectedProject.budget}</strong></div><div><span>Liability period</span><strong>5 years</strong></div></div><button className="button dark-button" onClick={() => setActiveNav('Projects')}>Open project <ArrowUpRight size={16} /></button></div>
          </section>
          <footer className="page-footer"><span>SADAK SAKSHI <i>•</i> ACCOUNTABILITY INFRASTRUCTURE</span><span>LAST SYNC 09:42:18 IST <i className="footer-live" /></span></footer>
        </div>
      </main>

      {showCreate && <div className="modal-backdrop" onClick={() => setShowCreate(false)}><div className="modal" onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><div className="eyebrow compact"><span className="eyebrow-line" />NEW RECORD</div><h2>Register a project</h2></div><button className="icon-button" onClick={() => setShowCreate(false)} aria-label="Close"><X size={18} /></button></div><p className="modal-copy">Start a traceable record for a new public infrastructure project.</p><label>Project name<input defaultValue="" placeholder="e.g. NH-48 Safety Improvements" /></label><label>Location<input defaultValue="" placeholder="City, State" /></label><div className="form-row"><label>Contract value<input placeholder="₹ 00.0 Cr" /></label><label>Liability period<select defaultValue="5 years"><option>5 years</option><option>3 years</option><option>10 years</option></select></label></div><button className="button primary full-width" onClick={() => { setShowCreate(false); setToast('Project draft created'); }}>Create project record <ArrowUpRight size={16} /></button></div></div>}
      {toast && <div className="toast"><CircleCheck size={17} />{toast}</div>}
    </div>
  );
}

export default App;
