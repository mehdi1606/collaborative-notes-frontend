import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { notesService, shareService } from '../services/api';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import {
  PlusIcon,
  DocumentTextIcon,
  ShareIcon,
  EyeIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowRightIcon,
  TagIcon
} from '@heroicons/react/24/outline';

// Page container
const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const Welcome = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const WelcomeText = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.lg};
  margin: 0;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 0.75rem;
  
  @media (max-width: 640px) {
    width: 100%;
    
    button {
      flex: 1;
    }
  }
`;

// Stats grid
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.color || props.theme.colors.primary};
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.color || props.theme.colors.primary}15;
  color: ${props => props.color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const StatLink = styled(Link)`
  position: absolute;
  inset: 0;
  text-decoration: none;
`;

// Content sections
const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  margin: 0;
  flex: 1;
`;

const SectionAction = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const SectionContent = styled.div`
  padding: 0 1.5rem 1.5rem;
`;

// Recent notes
const NotesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const NoteCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  text-decoration: none;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.hover};
    transform: translateX(4px);
  }
`;

const NoteIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => {
    switch (props.status) {
      case 'public': return props.theme.colors.success + '15';
      case 'shared': return props.theme.colors.info + '15';
      default: return props.theme.colors.secondary + '15';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'public': return props.theme.colors.success;
      case 'shared': return props.theme.colors.info;
      default: return props.theme.colors.secondary;
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const NoteContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NoteTitle = styled.div`
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NoteMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textMuted};
`;

const NoteDate = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const NoteTags = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

// Activity feed
const ActivityFeed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ActivityIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.color || props.theme.colors.primary}15;
  color: ${props => props.color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.typography.fontSize.xs};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textMuted};
  
  svg {
    width: 48px;
    height: 48px;
    margin: 0 auto 1rem;
    opacity: 0.5;
  }
`;

const DashboardPage = () => {
  const { user } = useAuth();
  const { showError } = useNotification();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    private: 0,
    shared: 0,
    public: 0
  });
  const [recentNotes, setRecentNotes] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        const [statsResponse, notesResponse, sharingResponse] = await Promise.all([
          notesService.getNoteStats(),
          notesService.getRecentNotes(5),
          shareService.getReceivedShares({ limit: 5 })
        ]);

        setStats(statsResponse.data.stats);
        setRecentNotes(notesResponse.data.notes || []);
        
        // Mock activity data (you can replace with real activity feed)
        const mockActivity = [
          {
            id: 1,
            type: 'note_created',
            text: 'You created a new note',
            time: '2 hours ago',
            icon: <DocumentTextIcon />,
            color: '#10b981'
          },
          {
            id: 2,
            type: 'note_shared',
            text: 'John shared a note with you',
            time: '1 day ago',
            icon: <ShareIcon />,
            color: '#3b82f6'
          },
          {
            id: 3,
            type: 'note_published',
            text: 'You published a note publicly',
            time: '2 days ago',
            icon: <EyeIcon />,
            color: '#f59e0b'
          }
        ];
        
        setRecentActivity(mockActivity);
        
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [showError]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Get note icon based on status
  const getNoteIcon = (status) => {
    switch (status) {
      case 'public': return <EyeIcon />;
      case 'shared': return <ShareIcon />;
      default: return <DocumentTextIcon />;
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading dashboard..." />;
  }

  return (
    <PageContainer>
      <PageHeader>
        <Welcome>
          <WelcomeText>
            <Title>Welcome back, {user?.name?.split(' ')[0]}!</Title>
            <Subtitle>Here's what's happening with your notes</Subtitle>
          </WelcomeText>
          <QuickActions>
            <Button
              variant="primary"
              leftIcon={<PlusIcon />}
              onClick={() => navigate('/notes/new')}
            >
              New Note
            </Button>
            <Button
              variant="outline"
              leftIcon={<ChartBarIcon />}
              onClick={() => navigate('/search')}
            >
              Search
            </Button>
          </QuickActions>
        </Welcome>

        {/* Stats Grid */}
        <StatsGrid>
          <StatCard color="#10b981">
            <StatLink to="/notes" />
            <StatHeader>
              <StatIcon color="#10b981">
                <DocumentTextIcon />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total Notes</StatLabel>
          </StatCard>

          <StatCard color="#3b82f6">
            <StatLink to="/notes?status=private" />
            <StatHeader>
              <StatIcon color="#3b82f6">
                <DocumentTextIcon />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.private}</StatValue>
            <StatLabel>Private Notes</StatLabel>
          </StatCard>

          <StatCard color="#f59e0b">
            <StatLink to="/shared" />
            <StatHeader>
              <StatIcon color="#f59e0b">
                <ShareIcon />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.shared}</StatValue>
            <StatLabel>Shared Notes</StatLabel>
          </StatCard>

          <StatCard color="#ef4444">
            <StatLink to="/notes?status=public" />
            <StatHeader>
              <StatIcon color="#ef4444">
                <EyeIcon />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.public}</StatValue>
            <StatLabel>Public Notes</StatLabel>
          </StatCard>
        </StatsGrid>
      </PageHeader>

      <ContentGrid>
        {/* Recent Notes */}
        <Section>
          <SectionHeader>
            <SectionTitle>Recent Notes</SectionTitle>
            <SectionAction to="/notes">
              View all <ArrowRightIcon />
            </SectionAction>
          </SectionHeader>
          <SectionContent>
            {recentNotes.length > 0 ? (
              <NotesList>
                {recentNotes.map((note) => (
                  <NoteCard key={note.id} to={`/notes/${note.id}`}>
                    <NoteIcon status={note.status}>
                      {getNoteIcon(note.status)}
                    </NoteIcon>
                    <NoteContent>
                      <NoteTitle>{note.title}</NoteTitle>
                      <NoteMeta>
                        <NoteDate>
                          <ClockIcon />
                          {formatDate(note.updated_at)}
                        </NoteDate>
                        {note.tags && (
                          <NoteTags>
                            <TagIcon />
                            {note.tags.split(',').length} tags
                          </NoteTags>
                        )}
                      </NoteMeta>
                    </NoteContent>
                  </NoteCard>
                ))}
              </NotesList>
            ) : (
              <EmptyState>
                <DocumentTextIcon />
                <div>No notes yet</div>
                <div style={{ marginTop: '0.5rem' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<PlusIcon />}
                    onClick={() => navigate('/notes/new')}
                  >
                    Create your first note
                  </Button>
                </div>
              </EmptyState>
            )}
          </SectionContent>
        </Section>

        {/* Recent Activity */}
        <Section>
          <SectionHeader>
            <SectionTitle>Recent Activity</SectionTitle>
          </SectionHeader>
          <SectionContent>
            {recentActivity.length > 0 ? (
              <ActivityFeed>
                {recentActivity.map((activity) => (
                  <ActivityItem key={activity.id}>
                    <ActivityIcon color={activity.color}>
                      {activity.icon}
                    </ActivityIcon>
                    <ActivityContent>
                      <ActivityText>{activity.text}</ActivityText>
                      <ActivityTime>{activity.time}</ActivityTime>
                    </ActivityContent>
                  </ActivityItem>
                ))}
              </ActivityFeed>
            ) : (
              <EmptyState>
                <ChartBarIcon />
                <div>No recent activity</div>
              </EmptyState>
            )}
          </SectionContent>
        </Section>
      </ContentGrid>
    </PageContainer>
  );
};

export default DashboardPage;