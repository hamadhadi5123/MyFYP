import React, { useState } from 'react';
import { CausalNode, CausalEdge } from '../../types';
import { Info, HelpCircle } from 'lucide-react';

interface InteractiveCausalGraphProps {
  nodes: CausalNode[];
  edges: CausalEdge[];
  selectedNodeId?: string | null;
  onSelectNode: (node: CausalNode | null) => void;
}

export const InteractiveCausalGraph: React.FC<InteractiveCausalGraphProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const getNodeColor = (category: CausalNode['category'], isSelected: boolean) => {
    switch (category) {
      case 'treatment':
        return isSelected ? '#10B981' : '#059669'; // Emerald
      case 'outcome':
        return isSelected ? '#6366F1' : '#4F46E5'; // Indigo
      case 'confounder':
        return isSelected ? '#F59E0B' : '#D97706'; // Amber
      case 'mediator':
        return isSelected ? '#8B5CF6' : '#7C3AED'; // Purple
      case 'decision':
        return isSelected ? '#06B6D4' : '#0891B2'; // Cyan
      default:
        return '#64748B';
    }
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      {/* Graph Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Structural Directed Acyclic Graph (DAG)</span>
            <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              Interactive
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any variable node to inspect its causal role, backdoor paths, and assumptions.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Confounder
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Treatment (X)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            Mediator
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            Outcome (Y)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            Decision
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative p-6 flex justify-center bg-radial-gradient">
        <svg
          viewBox="0 0 520 340"
          className="w-full max-w-2xl h-auto select-none overflow-visible"
        >
          <defs>
            {/* Arrow Marker Standard */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#94A3B8" />
            </marker>
            {/* Arrow Marker Confounding (Amber) */}
            <marker
              id="arrow-confound"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#F59E0B" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge, idx) => {
            const source = nodes.find(n => n.id === edge.from);
            const target = nodes.find(n => n.id === edge.to);
            if (!source || !target) return null;

            const isHighlighted =
              hoveredNodeId === edge.from ||
              hoveredNodeId === edge.to ||
              selectedNodeId === edge.from ||
              selectedNodeId === edge.to;

            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;

            return (
              <g key={idx} className="transition-all duration-300">
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={
                    edge.isConfounding
                      ? '#F59E0B'
                      : isHighlighted
                      ? '#10B981'
                      : '#94A3B8'
                  }
                  strokeWidth={isHighlighted ? 2.5 : edge.isConfounding ? 2 : 1.5}
                  strokeDasharray={edge.isConfounding ? '4,4' : undefined}
                  markerEnd={edge.isConfounding ? 'url(#arrow-confound)' : 'url(#arrow)'}
                />
                {edge.label && (
                  <text
                    x={midX}
                    y={midY - 6}
                    fill={edge.isConfounding ? '#D97706' : '#64748B'}
                    fontSize="9"
                    fontWeight="600"
                    textAnchor="middle"
                    className="bg-white px-1"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const color = getNodeColor(node.category, isSelected);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onSelectNode(isSelected ? null : node)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="cursor-pointer transition-transform duration-200"
                style={{
                  transform: isHovered || isSelected ? `translate(${node.x}px, ${node.y}px) scale(1.08)` : `translate(${node.x}px, ${node.y}px)`
                }}
              >
                {/* Node Outer Halo on select/hover */}
                {(isSelected || isHovered) && (
                  <circle
                    r="32"
                    fill={color}
                    opacity="0.2"
                    className="animate-pulse"
                  />
                )}

                {/* Node Circle */}
                <circle
                  r="24"
                  fill={color}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="shadow-lg filter drop-shadow"
                />

                {/* Node Label */}
                <text
                  y="38"
                  textAnchor="middle"
                  fill="#0F172A"
                  className="dark:fill-slate-100 font-bold"
                  fontSize="10"
                >
                  {node.label}
                </text>
                <text
                  y="49"
                  textAnchor="middle"
                  fill="#64748B"
                  fontSize="8"
                  fontWeight="500"
                  className="uppercase tracking-wider"
                >
                  {node.category}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode ? (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 animate-fade-in flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {selectedNode.label}
              </span>
              <span className="uppercase tracking-wider text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {selectedNode.category}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {selectedNode.description}
            </p>
          </div>
          <button
            onClick={() => onSelectNode(null)}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium"
          >
            Dismiss
          </button>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-center text-xs text-slate-500">
          Tip: Click on nodes to isolate backdoor confounding paths and causal mechanisms.
        </div>
      )}
    </div>
  );
};
