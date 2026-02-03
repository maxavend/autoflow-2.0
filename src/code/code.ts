// 1. Interface Definitions
interface RGB {
  r: number;
  g: number;
  b: number;
}

interface PluginConfig {
  anchors: { source: string; target: string };
  color: string;
  pathType: string;
  caps: { start: string; end: string };
  weight: string;
  stroke: string;
}

interface PluginMessage {
  type: 'update-config' | 'selection-change' | 'paste-connector';
  payload?: any;
}

// 2. Global State
let lastTwoSelectedNodes: SceneNode[] = [];
let currentConfig: PluginConfig = {
  anchors: { source: 'BOTTOM', target: 'TOP' },
  color: '#ef4444',
  pathType: 'Angled',
  caps: { start: 'None', end: 'None' },
  weight: 'Thin',
  stroke: 'Solid'
};

let processingPaste = false;

// 3. Helper Functions

function hexToRgb(hex: string): RGB {
  const cleanHex = hex.replace(/^#/, '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r: r / 255, g: g / 255, b: b / 255 };
}

function getMagnet(anchor: string): 'AUTO' | 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT' | 'CENTER' {
  switch (anchor) {
    case 'TOP': return 'TOP';
    case 'BOTTOM': return 'BOTTOM';
    case 'LEFT': return 'LEFT';
    case 'RIGHT': return 'RIGHT';
    default: return 'AUTO';
  }
}

function getCapType(cap: string): "NONE" | "ARROW_EQUILATERAL" | "TRIANGLE_FILLED" | "DIAMOND_FILLED" | "CIRCLE_FILLED" {
  switch(cap.toLowerCase()) {
    case 'arrow': return 'ARROW_EQUILATERAL';
    case 'triangle': return 'TRIANGLE_FILLED'; // Visual map for 'Triangle'
    case 'diamond': return 'DIAMOND_FILLED';
    case 'circle': return 'CIRCLE_FILLED';
    case 'solid': return 'TRIANGLE_FILLED'; // Map 'Solid' to Triangle Filled often used as standard solid arrow
    default: return 'NONE';
  }
}

function applyStylesToConnector(connector: ConnectorNode, config: PluginConfig) {
  // 1. Path Type
  const pathTypeMap: { [key: string]: 'ELBOWED' | 'CURVED' | 'STRAIGHT' } = {
    'Angled': 'ELBOWED', 'Curved': 'CURVED', 'Straight': 'STRAIGHT'
  };
  connector.connectorLineType = pathTypeMap[config.pathType] || 'ELBOWED';

  // 2. Corner Radius (Fixed to 16px for Elbowed)
  if (connector.connectorLineType === 'ELBOWED') {
      connector.cornerRadius = 16;
  }
  
  // 3. Stroke Weight
  const weightMap: { [key: string]: number } = {
    'Thin': 2, 'Medium': 4, 'Thick': 8
  };
  connector.strokeWeight = weightMap[config.weight] || 2;
  
  // 4. Color
  const rgb = hexToRgb(config.color || '#000000');
  connector.strokes = [{ type: 'SOLID', color: rgb }];
  
  // 5. Stroke Style (Dashed/Solid)
  if (config.stroke === 'Dashed') {
    connector.dashPattern = [10, 10];
  } else {
    connector.dashPattern = [];
  }
  
  // 6. Caps (Start/End)
  // Figma strict types required
  connector.connectorStartStrokeCap = getCapType(config.caps.start || 'None');
  connector.connectorEndStrokeCap = getCapType(config.caps.end || 'None');
}

// 4. Main Direct Logic

figma.showUI(__html__, { width: 380, height: 600, themeColors: true });

// Listen for selection changes ("Magic Paste" Logic)
figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection;
  const count = selection.length;
  
  // Send count and node names to UI
  const nodeNames = selection.length === 2 && selection.every((n: any) => n.type !== 'CONNECTOR') 
    ? [selection[0].name, selection[1].name] 
    : [];
  
  figma.ui.postMessage({ 
    type: 'selection-change', 
    payload: { count, nodeNames } 
  });

  // 1. Track potential targets (Frames, Shapes, etc) - NON-connector nodes
  if (count === 2) {
    // Store as potential connection targets
    // Use type assertion to bypass TypeScript's overly strict type checking
    const node1 = selection[0] as any;
    const node2 = selection[1] as any;
    
    // Only store if they look like valid nodes (not already connectors)
    if (node1.type !== 'CONNECTOR' && node2.type !== 'CONNECTOR') {
       lastTwoSelectedNodes = [selection[0], selection[1]];
       console.log('[Auto Paste] Stored 2 target nodes, auto-clearing selection for paste...');
       
       // AUTO-DESELECT: Clear selection so Ctrl+V pastes OUTSIDE, not inside frames
       figma.currentPage.selection = [];
    }
  }

  // 2. Detect Paste - Check if connectors appeared (either selected or pasted inside targets)
  // Use type assertion for the check
  const selectionHasConnectors = selection.some((n: any) => n.type === 'CONNECTOR');
  
  if (selectionHasConnectors && lastTwoSelectedNodes.length === 2 && !processingPaste) {
    processingPaste = true;
    
    // CAPTURE CONNECTOR IDS IMMEDIATELY (before selection changes)
    const initialConnectorIds: string[] = [];
    selection.forEach((node: any) => {
      if (node.type === 'CONNECTOR') {
        initialConnectorIds.push(node.id);
      }
    });
    console.log(`[Auto Paste] Captured ${initialConnectorIds.length} connector(s) immediately`);
    
    const [node1Id, node2Id] = lastTwoSelectedNodes.map(n => n.id);
    
    // Reduced timeout for faster processing
    setTimeout(async () => {
      try {
        // Retrieve fresh target nodes using ASYNC API
        const node1 = await figma.getNodeByIdAsync(node1Id) as SceneNode;
        const node2 = await figma.getNodeByIdAsync(node2Id) as SceneNode;
        
        if (!node1 || !node2 || node1.removed || node2.removed) {
          console.log('[Auto Paste] Target nodes no longer valid');
          processingPaste = false;
          return;
        }

        // Use BOTH: initially captured IDs + search inside target nodes
        const connectorIds: string[] = [...initialConnectorIds];
        
        // Also search inside target nodes (in case they were pasted there)
        [node1, node2].forEach(targetNode => {
          if ('children' in targetNode) {
            (targetNode as any).children.forEach((child: any) => {
              if (child.type === 'CONNECTOR' && !connectorIds.includes(child.id)) {
                connectorIds.push(child.id);
              }
            });
          }
        });
        
        console.log(`[Auto Paste] Found ${connectorIds.length} connector(s) total`);
        
        if (connectorIds.length === 0) {
          console.log('[Auto Paste] No connectors found to process');
          processingPaste = false;
          return;
        }

        // Retrieve fresh connector nodes using ASYNC API
        const connectorPromises = connectorIds.map(id => figma.getNodeByIdAsync(id));
        const connectorNodes = await Promise.all(connectorPromises);
        const connectors = connectorNodes.filter(n => n && !n.removed) as ConnectorNode[];
          
        if (connectors.length === 0) {
          console.log('[Magic Paste] Connectors disappeared during timeout');
          processingPaste = false;
          return;
        }

        console.log(`[Magic Paste] Processing ${connectors.length} valid connector(s)...`);
        
        // Pick the first connector as master
        const mainConnector = connectors[0];
        
        // Move to page if it's trapped inside a frame
        if (mainConnector.parent !== figma.currentPage) {
          console.log('[Auto Paste] Moving connector out of frame to page');
          figma.currentPage.appendChild(mainConnector);
        }
        
        // Remove duplicates
        for (let i = 1; i < connectors.length; i++) {
          console.log(`[Auto Paste] Removing duplicate connector ${i}`);
          connectors[i].remove();
        }

        // Make connector 10px and STRAIGHT (discrete/invisible position)
        const centerX = (node1.x + node2.x) / 2;
        const centerY = (node1.y + node2.y) / 2;
        mainConnector.x = centerX;
        mainConnector.y = centerY;
        mainConnector.resize(10, 0); // 10px wide, 0px tall = straight line
        console.log('[Auto Paste] Made connector 10px straight');

        // Notify UI
        figma.ui.postMessage({ type: 'processing', payload: { message: 'Applying styles...' } });

        // Apply configuration
        applyStylesToConnector(mainConnector, currentConfig);

        // Connect to target nodes
        mainConnector.connectorStart = {
          endpointNodeId: node1.id,
          magnet: getMagnet(currentConfig.anchors.source)
        };
        
        mainConnector.connectorEnd = {
          endpointNodeId: node2.id,
          magnet: getMagnet(currentConfig.anchors.target)
        };
        
        // AUTO-DESELECT: Clean UX - don't leave connector selected
        figma.currentPage.selection = [];
        
        // Success feedback
        figma.ui.postMessage({ type: 'connected' });
        console.log('[Auto Paste] ✓ Successfully connected and auto-deselected!');
        
        // Clear state
        lastTwoSelectedNodes = [];
        
      } catch (err) {
        console.error('[Auto Paste] Error during processing:', err);
        figma.ui.postMessage({ type: 'error', payload: { message: 'Failed to process connector' } });
      } finally {
        processingPaste = false; // Always reset
      }
    }, 30); // Reduced from 100ms to 30ms for instant feel
  }
});

figma.ui.onmessage = async (msg: PluginMessage) => {
  if (msg.type === 'update-config') {
    if (msg.payload) {
        currentConfig = msg.payload;
        // console.log('[Backend] Config updated:', currentConfig);
    }
  }
};
