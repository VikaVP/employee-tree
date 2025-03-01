'use client';

import Image from 'next/image';
import { OrganizationChart } from 'primereact/organizationchart';
import { ScrollPanel } from 'primereact/scrollpanel';
import React, { useRef } from 'react';

import { useHierarchy } from '@/hooks/UseHierarchy';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export default function OrgChart({ query }: { query: TreeNode | null }) {
  const bottomRef = useRef(null);
  const { hierarchy, count } = useHierarchy({
    query,
    bottomRef,
  });

  const nodeTemplate = (node: any) => {
    if (node.type === 'person') {
      return (
        <div className="flex flex-col">
          <div className="flex flex-col items-center ">
            <Image
              alt={node.data.name}
              src={node.data.image}
              className="mb-3 size-12 rounded-full"
              width={20}
              height={20}
            />
            <span className="mb-2 font-bold">{node.data.name}</span>
            <span>{node.data.title}</span>
          </div>
        </div>
      );
    }

    return node.label;
  };

  return (
    <div className="card overflow-x-auto">
      {query?.id ? (
        typeof hierarchy === 'object' && hierarchy?.id ? (
          <ScrollPanel
            style={{ width: '100%', height: '50vh' }}
            className="custombar1"
          >
            <OrganizationChart
              value={[hierarchy]}
              nodeTemplate={nodeTemplate}
            />
            <div ref={bottomRef} />
            <Alert className="fixed bottom-2 left-2 sm:bottom-4 sm:left-40 sm:max-w-max">
              <AlertTitle>{query.name}</AlertTitle>
              <AlertDescription>
                <p>
                  Total of Direct Reports :{' '}
                  <span className="font-bold italic">{count.direct}</span>
                </p>
                <p>
                  Total Indirect Reports :{' '}
                  <span className="font-bold italic">{count.indirect}</span>
                </p>
              </AlertDescription>
            </Alert>
          </ScrollPanel>
        ) : (
          <p className="my-52 w-full text-center sm:my-40">
            {JSON.stringify(hierarchy)}
          </p>
        )
      ) : (
        <p className="my-52 w-full text-center sm:my-40">
          Please choose employee to render Hierarchy
        </p>
      )}
    </div>
  );
}
