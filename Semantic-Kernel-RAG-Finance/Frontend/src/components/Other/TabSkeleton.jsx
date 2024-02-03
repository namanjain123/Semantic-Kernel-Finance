import React from 'react';
import './TabSkelleton.css';
export default function TabSkeleton(times) {
  
  const skeletonLines = Array.from({ length: times.times }, (_, index) => (
    <div key={index} className="skeleton-line" />
  ));

  return <div className="skeleton-loader">{skeletonLines}</div>;
}
