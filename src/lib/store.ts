import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { authApi } from '@/services/auth.api';
import { dashboardApi } from '@/services/dashboard.api';
import { leadsApi } from '@/services/leads.api';
import authReducer from '@/store/slices/authSlice';
import { paymentApi } from '@/services/payment.api';
import { campaignApi } from '@/services/campaign.api';
import { teamApi } from '@/services/team.api';
import { templateApi } from '@/services/template.api';
import { activityLogApi } from '@/services/activity-log.api';
import campaignCreationReducer from '@/store/slices/campaignCreationSlice';
import { reportsApi } from '@/services/reports.api';
import { faqApi } from '@/services/faq.api';
import { galleryApi } from '@/services/gallery.api';
import { newsApi } from '@/services/news.api';
import { categoryApi } from '@/services/category.api';
export const store = configureStore({
	reducer: {
		auth: authReducer,
		[authApi.reducerPath]: authApi.reducer,
		[dashboardApi.reducerPath]: dashboardApi.reducer,
		[leadsApi.reducerPath]: leadsApi.reducer,
		[paymentApi.reducerPath]: paymentApi.reducer,
		[campaignApi.reducerPath]: campaignApi.reducer,
		[teamApi.reducerPath]: teamApi.reducer,
		[templateApi.reducerPath]: templateApi.reducer,
		[activityLogApi.reducerPath]: activityLogApi.reducer,
		campaignCreation: campaignCreationReducer,
		[reportsApi.reducerPath]: reportsApi.reducer,
		[faqApi.reducerPath]: faqApi.reducer,
		[galleryApi.reducerPath]: galleryApi.reducer,
		[newsApi.reducerPath]: newsApi.reducer,
		[categoryApi.reducerPath]: categoryApi.reducer,

	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			authApi.middleware,
			dashboardApi.middleware,
			leadsApi.middleware,
			paymentApi.middleware,
			campaignApi.middleware,
			teamApi.middleware,
			templateApi.middleware,
			activityLogApi.middleware,
			reportsApi.middleware,
			faqApi.middleware,
			galleryApi.middleware,
			newsApi.middleware,
			categoryApi.middleware,

		),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;