import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, CircularProgress, Alert, Container, 
  Fade, Breadcrumbs, Link 
} from '@mui/material';
import { ShieldCheck, Home, ChevronRight } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileBanner from '../components/profile/ProfileBanner';
import ProfileTabs from '../components/profile/ProfileTabs';
import ProfileSearch from '../components/profile/ProfileSearch';

// 12 Tabs
import PersonalInfoTab from '../components/profile/tabs/PersonalInfoTab';
import EmploymentDetailsTab from '../components/profile/tabs/EmploymentDetailsTab';
import RegistrationDetailsTab from '../components/profile/tabs/RegistrationDetailsTab';
import UploadedDocumentsTab from '../components/profile/tabs/UploadedDocumentsTab';
import QualificationTab from '../components/profile/tabs/QualificationTab';
import ExperienceTab from '../components/profile/tabs/ExperienceTab';
import CoursesTab from '../components/profile/tabs/CoursesTab';
import TrainingHistoryTab from '../components/profile/tabs/TrainingHistoryTab';
import CertificationsTab from '../components/profile/tabs/CertificationsTab';
import AIRecommendationsTab from '../components/profile/tabs/AIRecommendationsTab';
import ActivityTimelineTab from '../components/profile/tabs/ActivityTimelineTab';
import SettingsTab from '../components/profile/tabs/SettingsTab';

// Modals
import EditProfileModal from '../components/profile/modals/EditProfileModal';
import EmployeeIDCardModal from '../components/profile/modals/EmployeeIDCardModal';
import QRCodeModal from '../components/profile/modals/QRCodeModal';

import api from '../services/api';

const ProfilePage = () => {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [idCardModalOpen, setIdCardModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const fetchServiceRecord = async () => {
    try {
      setLoading(true);
      const res = await api.get('/profile/record');
      setRecord(res.data);
      setError('');
    } catch (err) {
      console.error('Failed to load digital service record:', err);
      setError('Unable to load digital service record. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceRecord();
  }, []);

  // Handle in-profile filter clicks
  const handleFilterChange = (filterVal) => {
    setActiveFilter(filterVal);
    if (filterVal === 'documents') setActiveTab(3);
    else if (filterVal === 'courses') setActiveTab(6);
    else if (filterVal === 'training') setActiveTab(7);
    else if (filterVal === 'certificates') setActiveTab(8);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && !record) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
          <CircularProgress size={50} thickness={4} />
          <Typography variant="body1" color="text.secondary" fontWeight={600}>
            Loading Government Digital Service Record...
          </Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1280, mx: 'auto', pb: 6 }}>
        {/* Breadcrumb Navigation */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Breadcrumbs separator={<ChevronRight size={14} color="#94A3B8" />} aria-label="breadcrumb">
            <Link color="inherit" href="/dashboard" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', fontSize: '0.85rem' }}>
              <Home size={14} /> Dashboard
            </Link>
            <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Digital Service Record
            </Typography>
          </Breadcrumbs>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* 1. Header Banner */}
        <ProfileBanner
          record={record}
          onEditProfile={() => setEditModalOpen(true)}
          onOpenIdCard={() => setIdCardModalOpen(true)}
          onOpenQrCode={() => setQrModalOpen(true)}
          onPrint={handlePrint}
        />

        {/* 2. Global Search & Filter Bar */}
        <ProfileSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        {/* 3. Horizontal ERP Tabs */}
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 4. Tab Panels */}
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && <PersonalInfoTab record={record} onEdit={() => setEditModalOpen(true)} />}
          {activeTab === 1 && <EmploymentDetailsTab record={record} />}
          {activeTab === 2 && <RegistrationDetailsTab record={record} />}
          {activeTab === 3 && <UploadedDocumentsTab record={record} onDocumentUpdated={fetchServiceRecord} />}
          {activeTab === 4 && <QualificationTab record={record} />}
          {activeTab === 5 && <ExperienceTab record={record} />}
          {activeTab === 6 && <CoursesTab record={record} />}
          {activeTab === 7 && <TrainingHistoryTab record={record} />}
          {activeTab === 8 && <CertificationsTab record={record} />}
          {activeTab === 9 && <AIRecommendationsTab record={record} />}
          {activeTab === 10 && <ActivityTimelineTab record={record} />}
          {activeTab === 11 && <SettingsTab record={record} onSettingsUpdated={fetchServiceRecord} />}
        </Box>

        {/* Modals */}
        <EditProfileModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          record={record}
          onProfileUpdated={fetchServiceRecord}
        />

        <EmployeeIDCardModal
          open={idCardModalOpen}
          onClose={() => setIdCardModalOpen(false)}
          record={record}
        />

        <QRCodeModal
          open={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          record={record}
        />
      </Box>
    </DashboardLayout>
  );
};

export default ProfilePage;
