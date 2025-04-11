import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type WidgetType = 'exchangeRates' | 'converter' | 'transaction' | 'menu' | 'form';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  gridColumn: string;
  gridRow: string;
  width: number; // Number of grid columns
  height: number; // Number of grid rows
  config?: any; // Specific widget configuration
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  isHomepage: boolean;
  widgets: Widget[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  className: string;
  jsRequired: boolean;
  isCustom: boolean;
}

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface Configuration {
  id: string;
  name: string;
  description: string;
  pages: Page[];
  currentPageId: string;
  template: Template;
  colorScheme: ColorScheme;
  useJavascript: boolean;
  apiKey: string;
}

interface CanvasContextType {
  configId: string;
  configName: string;
  configDescription: string
  widgets: Widget[];
  pages: Page[];
  currentPageId: string;
  selectedWidget: string | null;
  template: Template;
  colorScheme: ColorScheme;
  useJavascript: boolean;
  apiKey: string;
  addWidget: (widget: Omit<Widget, 'id'>) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  removeWidget: (id: string) => void;
  selectWidget: (id: string | null) => void;
  setConfigId: (id: string) => void;
  setConfigName: (name: string) => void;
  setConfigDescription: (description: string) => void;
  loadConfig: (config: Configuration) => void;
  setTemplate: (template: Template) => void;
  setColorScheme: (colors: Partial<ColorScheme>) => void;
  setUseJavascript: (use: boolean) => void;
  setApiKey: (key: string) => void;
  addPage: (page: Omit<Page, 'id' | 'widgets'>) => void;
  updatePage: (id: string, updates: Partial<Omit<Page, 'widgets'>>) => void;
  removePage: (id: string) => void;
  setCurrentPage: (id: string) => void;
  getPageBySlug: (slug: string) => Page | undefined;
}

const defaultTemplates: Template[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'A clean, minimalist design with focus on content',
    className: 'template-minimal',
    jsRequired: false,
    isCustom: false,
  },
  {
    id: 'crypto',
    name: 'Crypto Modern',
    description: 'A modern design for cryptocurrency exchanges',
    className: 'template-crypto',
    jsRequired: true,
    isCustom: false,
  },
  {
    id: 'classic',
    name: 'Classic Exchange',
    description: 'Traditional exchange layout with detailed information',
    className: 'template-classic',
    jsRequired: true,
    isCustom: false,
  },
];

const defaultColorScheme: ColorScheme = {
  primary: '#3B82F6', // Blue
  secondary: '#1F2937', // Dark gray
  accent: '#10B981', // Green
  background: '#111827', // Almost black
  text: '#F9FAFB', // White
};

const defaultHomePage: Page = {
  id: 'homepage',
  title: 'Home',
  slug: '/',
  isHomepage: true,
  widgets: [],
};

const defaultPages: Page[] = [defaultHomePage];

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [configId, setConfigId] = useState<string>("");
  const [configName, setConfigName] = useState<string>("");
  const [configDescription, setConfigDescription] = useState<string>("");
  const [pages, setPages] = useState<Page[]>(defaultPages);
  const [currentPageId, setCurrentPageId] = useState<string>(defaultHomePage.id);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [template, setTemplate] = useState<Template>(defaultTemplates[0]);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme);
  const [useJavascript, setUseJavascript] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    try {
      const savedState = localStorage.getItem("canvasState");
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setConfigId(parsedState.configId);
        setConfigName(parsedState.configName);
        setConfigDescription(parsedState.configDescription);
        setPages(parsedState.pages);
        setCurrentPageId(parsedState.currentPageId);
        setTemplate(parsedState.template);
        setColorScheme(parsedState.colorScheme);
        setUseJavascript(parsedState.useJavascript);
        setApiKey(parsedState.apiKey);
      }
    } catch (error) {
      console.log("Error parsing saved state", error);
    }
  }, []);

  useEffect(() => {
    const state = {
      configId,
      configName,
      configDescription,
      pages,
      currentPageId,
      template,
      colorScheme,
      useJavascript,
      apiKey,
    };
    localStorage.setItem("canvasState", JSON.stringify(state));
  }, [configId, configName, configDescription, pages, currentPageId, template, colorScheme, useJavascript, apiKey])

  const currentPage = pages.find(page => page.id === currentPageId) || defaultHomePage;  
  const widgets = currentPage ? currentPage.widgets : [];  

  const loadConfig = (config: Configuration) => {
    setConfigId(config.id);
    setConfigName(config.name);
    setConfigDescription(config.description);
    setPages(config.pages);
    setCurrentPageId(config.currentPageId);
    setTemplate(config.template);
    setColorScheme(config.colorScheme);
    setUseJavascript(config.useJavascript);
    setApiKey(config.apiKey);
  };

  const addWidget = (widget: Omit<Widget, 'id'>) => {
    const newWidget: Widget = {
      ...widget,
      id: `widget-${Date.now()}`,
    };
    
    setPages(prevPages => 
      prevPages.map(page => 
        page.id === currentPageId 
          ? { ...page, widgets: [...page.widgets, newWidget] } 
          : page
      )
    );
  };

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    setPages(prevPages => 
      prevPages.map(page => 
        page.id === currentPageId 
          ? { 
              ...page, 
              widgets: page.widgets.map(widget => 
                widget.id === id ? { ...widget, ...updates } : widget
              ) 
            } 
          : page
      )
    );
  };

  const removeWidget = (id: string) => {
    setPages(prevPages => 
      prevPages.map(page => 
        page.id === currentPageId 
          ? { ...page, widgets: page.widgets.filter(widget => widget.id !== id) } 
          : page
      )
    );
  };

  const selectWidget = (id: string | null) => {
    setSelectedWidget(id);
  };

  const addPage = (page: Omit<Page, 'id' | 'widgets'>) => {
    const newPage: Page = {
      ...page,
      id: `page-${Date.now()}`,
      widgets: [],
    };
    setPages([...pages, newPage]);
  };

  const updatePage = (id: string, updates: Partial<Omit<Page, 'widgets'>>) => {
    setPages(pages.map(page => (page.id === id ? { ...page, ...updates } : page)));
  };

  const removePage = (id: string) => {
    if (pages.find(page => page.id === id)?.isHomepage) {
      return;
    }
    
    if (id === currentPageId) {
      const homepage = pages.find(page => page.isHomepage);
      if (homepage) {
        setCurrentPageId(homepage.id);
      }
    }
    
    setPages(pages.filter(page => page.id !== id));
  };

  const setCurrentPage = (id: string) => {
    setCurrentPageId(id);
  };

  const getPageBySlug = (slug: string) => {
    return pages.find(page => page.slug === slug);
  };

  return (
    <CanvasContext.Provider
      value={{
        configId,
        configName,
        configDescription,
        widgets,
        pages,
        currentPageId,
        selectedWidget,
        template,
        colorScheme,
        useJavascript,
        apiKey,
        addWidget,
        updateWidget,
        removeWidget,
        selectWidget,
        setConfigId,
        setConfigName,
        setConfigDescription,
        loadConfig,
        setTemplate,
        setColorScheme: (colors) => setColorScheme({ ...colorScheme, ...colors }),
        setUseJavascript,
        setApiKey,
        addPage,
        updatePage,
        removePage,
        setCurrentPage,
        getPageBySlug,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};
