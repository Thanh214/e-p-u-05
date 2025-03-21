import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, User, Lock, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(username, password);
      
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn quay trở lại!",
      });
      
      // Điều hướng sau khi đăng nhập thành công
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Đăng nhập thất bại",
        description: error instanceof Error ? error.message : "Vui lòng kiểm tra thông tin đăng nhập",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-cream">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-8 p-6 md:p-8 bg-white rounded-xl shadow-lg animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-france-blue via-france-white to-france-red"></div>
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-full bg-navy/5">
              <BookOpen className="h-8 w-8 text-navy" />
            </div>
          </div>
          
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-navy">Chào mừng trở lại</h1>
            <p className="text-slate-600">
              Đăng nhập để tiếp tục hành trình học tập
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-france-blue focus:ring-france-blue/20"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-france-blue hover:text-navy hover:underline transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-france-blue focus:ring-france-blue/20"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => 
                    setRememberMe(checked as boolean)
                  }
                  className="text-france-blue focus:ring-france-blue/20"
                />
                <Label htmlFor="remember" className="text-sm">
                  Ghi nhớ đăng nhập trong 30 ngày
                </Label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-france-blue hover:bg-navy text-white transition-colors duration-300" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></span>
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                <span>Đăng nhập</span>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-300"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Hoặc</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white p-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-france-blue/20">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white p-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-france-blue/20">
              <svg className="h-5 w-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
              </svg>
              <span>Facebook</span>
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-slate-600">Chưa có tài khoản?</span>{" "}
            <Link to="/register" className="text-france-blue hover:text-navy hover:underline transition-colors">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column - Image and Text */}
      <div className="hidden md:flex flex-1 bg-gradient-to-r from-navy to-france-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/lovable-uploads/3472c6d3-c3a5-4769-ab03-b6d877b8d567.png')] bg-no-repeat bg-contain bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-navy/80 to-navy/60"></div>
        <div className="relative z-10 max-w-md p-12 flex flex-col justify-center items-start">
          <h2 className="text-3xl font-bold text-white mb-6">Tiếp tục hành trình học tập của bạn</h2>
          <p className="text-white/80 mb-8">
            Truy cập vào kho khóa học, theo dõi tiến độ học tập và kết nối với 
            cộng đồng người học từ khắp nơi trên thế giới.
          </p>
          <ul className="space-y-4">
            {[
              "Tiếp tục khóa học từ nơi bạn đã dừng lại",
              "Truy cập tài nguyên cao cấp đã mua",
              "Tham gia thảo luận cùng cộng đồng",
              "Theo dõi tiến độ học tập của bạn",
            ].map((item, i) => (
              <li key={i} className="flex items-start text-white">
                <div className="mr-3 mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-france-red/20 flex items-center justify-center">
                  <ArrowRight className="h-3 w-3 text-france-red" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
