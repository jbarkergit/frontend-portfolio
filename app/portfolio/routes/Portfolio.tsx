import { FeatureStateProvider } from 'app/portfolio/context/FeatureStateContext';
import { ProjectSlideIndexProvider } from 'app/portfolio/context/ProjectSlideContext';
import PortGrid from 'app/portfolio/features/PortGrid';
import { useRef } from 'react';

export default function () {
  const portfolioRef = useRef<HTMLDivElement>(null);

  return (
    <div className='portfolio' ref={portfolioRef}>
      <FeatureStateProvider>
        <ProjectSlideIndexProvider>
          <PortGrid portfolioRef={portfolioRef} />
        </ProjectSlideIndexProvider>
      </FeatureStateProvider>
    </div>
  );
}
