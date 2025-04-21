import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Divider, Button, Chip } from '@mui/material';
import { usePerformanceMetrics } from '../hooks/usePerformanceMonitor';
import { IAllPerformanceMetrics } from '../types';
import { isLocalOrDevEnvironment } from '@/utils/envUtils';

/**
 * 성능 모니터링 대시보드 컴포넌트
 * 로컬 또는 개발 환경에서만 표시됩니다.
 */
const PerformanceDashboard: React.FC = () => {
  const { getMetrics, logMetrics, clearMetrics, measureMemoryUsage } = usePerformanceMetrics();
  const [metrics, setMetrics] = useState<IAllPerformanceMetrics>({});
  const [isOpen, setIsOpen] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  // 데이터 새로고침
  const refreshData = () => {
    measureMemoryUsage();
    setMetrics(getMetrics());
  };

  // 초기 로드 및 주기적인 데이터 새로고침
  useEffect(() => {
    refreshData();

    // 대시보드가 열려있을 때만 주기적으로 새로고침
    if (isOpen && !refreshInterval) {
      const intervalId = window.setInterval(() => {
        refreshData();
      }, 3000); // 3초마다 새로고침
      setRefreshInterval(intervalId);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    };
  }, [isOpen]);

  // 대시보드를 열고 닫는 함수
  const toggleDashboard = () => {
    setIsOpen(!isOpen);
  };

  // 로컬 또는 개발 환경이 아니면 렌더링하지 않음
  if (!isLocalOrDevEnvironment()) {
    return null;
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
      {/* 토글 버튼 */}
      <Button
        variant="contained"
        color="primary"
        onClick={toggleDashboard}
        sx={{ borderRadius: '50%', minWidth: '60px', height: '60px' }}
      >
        {isOpen ? 'Close' : '📊'}
      </Button>

      {/* 대시보드 내용 */}
      {isOpen && (
        <Paper
          elevation={4}
          sx={{
            p: 2,
            mt: 2,
            width: '500px',
            maxHeight: '70vh',
            overflowY: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="h2">
              Performance Dashboard
            </Typography>
            <Box>
              <Button variant="outlined" size="small" onClick={refreshData} sx={{ mr: 1 }}>
                Refresh
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  clearMetrics();
                  refreshData();
                }}
                color="secondary"
              >
                Clear
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* 페이지 로드 메트릭 */}
          <Typography variant="subtitle1" gutterBottom>
            Page Load Metrics
          </Typography>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {metrics.pageLoad ? (
              <>
                <MetricItem
                  label="DOM Content Loaded"
                  value={metrics.pageLoad.domContentLoaded}
                  unit="ms"
                  threshold={1000}
                />
                <MetricItem
                  label="Page Load"
                  value={metrics.pageLoad.pageLoad}
                  unit="ms"
                  threshold={2000}
                />
                {metrics.pageLoad.firstContentfulPaint && (
                  <MetricItem
                    label="FCP"
                    value={metrics.pageLoad.firstContentfulPaint}
                    unit="ms"
                    threshold={1800}
                  />
                )}
                {metrics.pageLoad.largestContentfulPaint && (
                  <MetricItem
                    label="LCP"
                    value={metrics.pageLoad.largestContentfulPaint}
                    unit="ms"
                    threshold={2500}
                  />
                )}
                {metrics.pageLoad.cumulativeLayoutShift !== undefined && (
                  <MetricItem
                    label="CLS"
                    value={metrics.pageLoad.cumulativeLayoutShift}
                    unit=""
                    threshold={0.1}
                    decimals={3}
                  />
                )}
              </>
            ) : (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  No page load metrics available.
                </Typography>
              </Grid>
            )}
          </Grid>

          {/* API 메트릭 */}
          <Typography variant="subtitle1" gutterBottom>
            API Metrics {metrics.api?.length ? `(${metrics.api.length} calls)` : ''}
          </Typography>
          {metrics.api && metrics.api.length > 0 ? (
            <Box sx={{ mb: 2 }}>
              <Paper variant="outlined" sx={{ p: 1 }}>
                <Typography variant="body2" gutterBottom>
                  Slowest API Calls:
                </Typography>
                {[...metrics.api]
                  .sort((a, b) => b.duration - a.duration)
                  .slice(0, 5)
                  .map((api, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: api.duration > 1000 ? 'error.main' : 'text.primary',
                          fontSize: '0.8rem',
                        }}
                      >
                        {api.method} {api.url.substring(0, 30)}
                        {api.url.length > 30 ? '...' : ''} - {api.status}
                        <Chip
                          label={`${api.duration.toFixed(2)}ms`}
                          size="small"
                          color={api.duration > 1000 ? 'error' : 'default'}
                          sx={{ ml: 1, height: 20 }}
                        />
                      </Typography>
                    </Box>
                  ))}
                {metrics.api.length > 0 && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Avg:{' '}
                    {(
                      metrics.api.reduce((acc, curr) => acc + curr.duration, 0) / metrics.api.length
                    ).toFixed(2)}
                    ms
                  </Typography>
                )}
              </Paper>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No API metrics available.
            </Typography>
          )}

          {/* 컴포넌트 렌더링 메트릭 */}
          <Typography variant="subtitle1" gutterBottom>
            Component Render Metrics
          </Typography>
          {metrics.render && metrics.render.length > 0 ? (
            <Box sx={{ mb: 2 }}>
              <Paper variant="outlined" sx={{ p: 1 }}>
                <Typography variant="body2" gutterBottom>
                  Slowest Components:
                </Typography>
                {[...metrics.render]
                  .sort((a, b) => b.renderTime - a.renderTime)
                  .slice(0, 5)
                  .map((render, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: render.renderTime > 50 ? 'error.main' : 'text.primary',
                          fontSize: '0.8rem',
                        }}
                      >
                        {render.componentName}
                        <Chip
                          label={`${render.renderTime.toFixed(2)}ms`}
                          size="small"
                          color={render.renderTime > 50 ? 'error' : 'default'}
                          sx={{ ml: 1, height: 20 }}
                        />
                      </Typography>
                    </Box>
                  ))}
              </Paper>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No component render metrics available.
            </Typography>
          )}

          {/* 메모리 사용량 */}
          <Typography variant="subtitle1" gutterBottom>
            Memory Usage
          </Typography>
          {metrics.memory && metrics.memory.usedJSHeapSize ? (
            <Grid container spacing={1} sx={{ mb: 2 }}>
              <MetricItem
                label="Used Heap"
                value={metrics.memory.usedJSHeapSize / (1024 * 1024)}
                unit="MB"
                threshold={100}
              />
              <MetricItem
                label="Total Heap"
                value={(metrics.memory?.totalJSHeapSize ?? 0) / (1024 * 1024)}
                unit="MB"
              />
              <MetricItem
                label="Heap Limit"
                value={(metrics.memory?.jsHeapSizeLimit ?? 0) / (1024 * 1024)}
                unit="MB"
              />
              <MetricItem
                label="Usage"
                value={
                  ((metrics.memory?.usedJSHeapSize ?? 0) / (metrics.memory?.jsHeapSizeLimit ?? 1)) *
                  100
                }
                unit="%"
                threshold={80}
              />
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No memory metrics available.
            </Typography>
          )}

          {/* 하단 버튼 */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="text" onClick={logMetrics} size="small">
              Log to Console
            </Button>
            <Typography variant="caption" color="text.secondary">
              Local Dev Environment Only
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

/**
 * 단일 메트릭 항목 컴포넌트
 */
interface MetricItemProps {
  label: string;
  value: number;
  unit: string;
  threshold?: number;
  decimals?: number;
}

const MetricItem: React.FC<MetricItemProps> = ({ label, value, unit, threshold, decimals = 2 }) => {
  const isHighlighted = threshold !== undefined && value > threshold;

  return (
    <Grid item xs={6}>
      <Paper
        sx={{
          p: 1,
          backgroundColor: isHighlighted ? 'rgba(255, 0, 0, 0.05)' : undefined,
          border: isHighlighted ? '1px solid rgba(255, 0, 0, 0.2)' : undefined,
        }}
        variant="outlined"
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="body2"
          component="div"
          sx={{
            fontWeight: 'bold',
            color: isHighlighted ? 'error.main' : 'text.primary',
          }}
        >
          {value.toFixed(decimals)} {unit}
        </Typography>
      </Paper>
    </Grid>
  );
};

export default PerformanceDashboard;
