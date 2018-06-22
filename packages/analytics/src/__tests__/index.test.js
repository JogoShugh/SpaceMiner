import { AnalyticsContext, AnalyticsListener, withAnalytics, withAnalyticsContext } from '../';
import SrcAnalyticsListener from '../AnalyticsListener';
import SrcwithAnalytics from '../withAnalytics';
import SrcwithAnalyticsContext from '../withAnalyticsContext';
import SrcAnalyticsContext from '../AnalyticsContext';

test('an AnalyticsListener component is exported', () => {
  expect(AnalyticsListener).toEqual(SrcAnalyticsListener);
});
test('withAnalyticsListener function is exported', () => {
  expect(withAnalytics).toEqual(SrcwithAnalytics);
});
test('an AnalyticsContext component is exported', () => {
  expect(AnalyticsContext).toEqual(SrcAnalyticsContext);
});
test('withAnalyticsContext function is exported', () => {
  expect(withAnalyticsContext).toEqual(SrcwithAnalyticsContext);
});
