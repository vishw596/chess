import { Card, CardHeader, CardContent } from "./ui/card";

export const AuthWrapper = ({ title, children }:{
    title:string,
    children:React.ReactNode
}) => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-blue-800/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <Card className="w-full max-w-md bg-slate-800/90 shadow-2xl border border-blue-500/20 backdrop-blur-sm relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-500/5 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600"></div>
        
        <CardHeader className="relative z-10">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </h2>
        </CardHeader>
        <CardContent className="relative z-10">
          {children}
        </CardContent>
      </Card>
    </div>
  );