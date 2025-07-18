import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { AppContext } from "../../contexts/app.context";
import { useNavigate } from "react-router-dom";
import mainPath from "../../configs/constants/path";
import { isAxiosBadRequestError } from "../../utils/utils";
import { ErrorRespone } from "../../types/common.type";
import { useMutation } from "@tanstack/react-query";
import authApi from "../../apis/auth.api";
import { UserLoginDto } from "../../types/User/user.type";
import { setAccessTokenToLS, setProfileToLS } from "../../utils/auth";
import { useBoolean } from "@/hooks/use-boolean";
import { LoginSchema, loginSchema } from "./rule";

const useLoginPage = () => {
  const { control, handleSubmit, reset } = useForm<LoginSchema>({
    defaultValues: {
      password: "",
      username: "",
    },
    mode: "onChange",
    resolver: zodResolver(loginSchema),
  });

  const [error, setError] = useState<string | null>(null);

  const { setIsAuthenticated, setProfile, loadingPage, setLoadingPage } =
    useContext(AppContext);

  const navigate = useNavigate();

  const loginAccountMutation = useMutation({
    mutationFn: (body: UserLoginDto) => authApi.loginAccount(body),
  });

  const getProfileMutation = useMutation({
    mutationFn: authApi.getProfile,
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError(null);
      setLoadingPage(true);

      const loginResponse = await loginAccountMutation.mutateAsync(data);

      setAccessTokenToLS(loginResponse.access_token);
      setIsAuthenticated(true);

      const profileResponse = await getProfileMutation.mutateAsync();
      setProfileToLS(profileResponse.data);
      setProfile(profileResponse.data);

      navigate(mainPath.home);
    } catch (error) {
      if (isAxiosBadRequestError<ErrorRespone>(error)) {
        const formError = error.response?.data;
        if (formError) {
          setError("Email or password is not correct");
          setLoadingPage(false);
        }
      } else {
        setError("Email or password is not correct");
        setLoadingPage(false);
      }
    } finally {
      setLoadingPage(false);
    }
  });

  const { value: showPassword, onToggle } = useBoolean();

  return {
    control,
    error,
    onSubmit,
    reset,
    showPassword,
    onToggle,
    loadingPage,
  };
};

export default useLoginPage;
