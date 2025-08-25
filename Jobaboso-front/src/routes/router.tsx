import { createBrowserRouter } from 'react-router-dom';

import MainLayout from '@layout/MainLayout';
import LandingLayout from '@layout/LandingLayout';
import StaffLayout from '@layout/StaffLayout';
import AuthLayout from '@layout/AuthLayout';
import MyLayout from '@layout/MyLayout';
import EmploymentLayout from '@layout/EmploymentLayout';
import BenchmarkLayout from '@layout/BenchmarkLayout';
import MissionLayout from '@layout/MissionLayout';
import SignupUniversityPage from '@pages/auth/SignupUniversityPage';
import SignupCompanyPage from '@pages/auth/SignupCompanyPage';
import SpecEditPage from '@pages/my/SpecEditPage';
import SpecPage from '@pages/my/SpecPage';
import StatusPage from '@pages/employment/StatusPage';
import ApplyListPage from '@pages/employment/ApplyListPage';
import ApplicationDetailPage from '@pages/employment/ApplicationDetailPage';
import CalendarPage from '@pages/employment/CalendarPage';
import TouchPage from '@pages/employment/TouchPage';
import ReviewPage from '@pages/employment/ReviewPage';
import LoungeLayout from '@layout/LoungeLayout';
import HomePage from '@pages/home/HomePage';
import SignInPage from '@pages/auth/SignInPage';
import SignUpTypePage from '@pages/auth/SignUpTypePage';
import SignUpPersonalPage from '@pages/auth/SignUpPersonalPage';
import BenchmarkPage from '@pages/benchmark/BenchmarkPage';
import MissionPage from '@pages/mission/MissionPage';
import CommunityPage from '@pages/lounge/CommunityPage';
import CorporatePage from '@pages/lounge/CorporatePage';
import ReviewWritePage from '@pages/employment/ReviewWritePage';
import DocumentViewerPage from '@pages/employment/DocumentViewerPage';
import CompanyContentsPage from '@pages/company/CompanyContentsPage';
import CompanyContentWritePage from '@pages/company/CompanyContentWritePage';
import CompanyContentDetailPage from '@pages/company/CompanyContentDetailPage';
import CompanyLikesPage from '@pages/company/CompanyLikesPage';
import CompanyLikesCollectPage from '@pages/company/CompanyLikesCollectPage';
import CompanyContentsLayout from '@layout/CompanyContentsLayout';
import CompanyLikesLayout from '@layout/CompanyLikesLayout';
import StaffPage from '@pages/staff/StaffPage';
import StaffStudentsPage from '@pages/staff/StaffStudentsPage';
import LandingPage from '@pages/LandingPage';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: 'home', element: <HomePage /> },
          { path: 'staff/department', element: <StaffPage /> },
        ],
      },
      {
        element: <LandingLayout />,
        children: [
          { index: true, element: <LandingPage /> },
        ],
      },
    ],
  },
  {
    path: '/staff',
    element: <StaffLayout />,
    children: [{ path: 'students', element: <StaffStudentsPage /> }],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'signin', element: <SignInPage /> },
      { path: 'signup/type', element: <SignUpTypePage /> },
      { path: 'signup/personal', element: <SignUpPersonalPage /> },
      { path: 'signup/company', element: <SignupCompanyPage /> },
      { path: 'signup/university', element: <SignupUniversityPage /> },
    ],
  },
  {
    path: '/my',
    element: <MyLayout />,
    children: [
      { path: 'spec', element: <SpecPage /> },
      { path: 'spec/edit', element: <SpecEditPage /> },
    ],
  },
  {
    path: '/employment',
    element: <EmploymentLayout />,
    children: [
      { path: 'status', element: <StatusPage /> },
      { path: 'apply', element: <ApplyListPage /> },
      { path: 'applications/:id', element: <ApplicationDetailPage /> },
      { path: 'touch', element: <TouchPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'review/write', element: <ReviewWritePage /> },
    ],
  },
  {
    path: '/benchmark',
    element: <BenchmarkLayout />,
    children: [{ index: true, element: <BenchmarkPage /> }],
  },
  {
    path: '/mission',
    element: <MissionLayout />,
    children: [{ index: true, element: <MissionPage /> }],
  },
  {
    path: '/lounge',
    element: <LoungeLayout />,
    children: [
      { path: 'community', element: <CommunityPage /> },
      { path: 'corporate', element: <CorporatePage /> },
      { path: 'corporate/:id', element: <CompanyContentDetailPage /> },
    ],
  },
  {
    path: '/company',
    children: [
      {
        path: 'contents',
        element: <CompanyContentsLayout />,
        children: [
          { index: true, element: <CompanyContentsPage /> },
          { path: 'write', element: <CompanyContentWritePage /> },
          { path: ':id', element: <CompanyContentDetailPage /> },
        ],
      },
      {
        path: 'likes',
        element: <CompanyLikesLayout />,
        children: [
          { index: true, element: <CompanyLikesPage /> },
          { path: 'collect', element: <CompanyLikesCollectPage /> },
        ],
      },
      {
        path: 'spec',
        element: <CompanyLikesLayout />,
        children: [{ path: ':id', element: <SpecPage /> }],
      },
    ],
  },
]);

export default router;
