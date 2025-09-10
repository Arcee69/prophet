import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

import loginReducer from "../features/auth/loginSlice";
import getPricingReducer from "../features/pricing/getPricingSlice";
import getFaqsReducer from "../features/faqs/getFaqsSlice";
import getBlogsReducer from "../features/blogs/getBlogsSlice";
import getBrandsReducer from "../features/brands/getBrandsSlice";
import getBrandWatchReducer from "../features/brandWatch/getBrandWatchSlice";
import getProfileReducer from "../features/profile/getProfileSlice";
import getSubscriptionReducer from "../features/subscriptions/getSubscriptionSlice";
import getSubSettingsReducer from "../features/subSettings/getSubSettingsSlice";
import getTransactionReducer from "../features/transactions/getTransactionSlice";

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({ 
    // Add reducers here
    userLogin: loginReducer,
    allPricing: getPricingReducer,
    allFaqs: getFaqsReducer,
    allBlogs: getBlogsReducer,
    allBrands: getBrandsReducer,
    allBrandWatch: getBrandWatchReducer,
    userProfile: getProfileReducer,
    allSubscriptions: getSubscriptionReducer,
    allSubSettings: getSubSettingsReducer,
    allTransactions: getTransactionReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        // You can add middleware configuration options here if needed
        serializableCheck: false, // Often needed when using redux-persist
    }),
});

export const persistor = persistStore(store);
