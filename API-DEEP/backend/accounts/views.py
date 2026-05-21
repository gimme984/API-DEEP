from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from .models import User, PasswordResetToken
from .serializers import UserSerializer
import uuid

class UsuarioView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.funcao == 'ADMIN_TI':
            return User.objects.all()
        return User.objects.filter(id=user.id)

class TecnicosListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_queryset(self):
        return User.objects.filter(funcao__in=['TECNICO', 'ADMIN_TI'])

class TodosUsuariosListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.funcao == 'ADMIN_TI':
            return User.objects.all()
        return User.objects.filter(id=user.id)

class RegistroView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        data = request.data
        
        if User.objects.filter(username=data.get('username')).exists():
            return Response({'error': 'Usuário já existe'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=data.get('email')).exists():
            return Response({'error': 'E-mail já cadastrado'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=data.get('username'),
            email=data.get('email', ''),
            password=data.get('password'),
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            setor=data.get('setor', ''),
            ramal=data.get('ramal', ''),
            funcao='USUARIO'
        )
        
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class EsqueciSenhaView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'E-mail é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'E-mail não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        token = PasswordResetToken.objects.create(user=user)
        reset_url = f"http://localhost:5173/resetar-senha/{token.token}"
        
        send_mail(
            subject='Recuperação de Senha - Sistema de Chamados TI',
            message=f'Olá {user.first_name or user.username},\n\nVocê solicitou a recuperação de senha.\n\nClique no link abaixo para redefinir sua senha:\n{reset_url}\n\nEste link é válido por 24 horas.\n\nSe você não solicitou, ignore este e-mail.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        
        return Response({'message': 'E-mail enviado com sucesso'})

class ResetarSenhaView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, token):
        try:
            reset_token = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return Response({'error': 'Token inválido'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not reset_token.is_valid():
            return Response({'error': 'Token expirado'}, status=status.HTTP_400_BAD_REQUEST)
        
        new_password = request.data.get('new_password')
        if not new_password:
            return Response({'error': 'Nova senha é obrigatória'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = reset_token.user
        user.set_password(new_password)
        user.save()
        reset_token.used = True
        reset_token.save()
        
        return Response({'message': 'Senha alterada com sucesso'})

class AtualizarPerfilView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request):
        user = request.user
        data = request.data
        
        # Atualizar campos permitidos
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.email = data.get('email', user.email)
        user.setor = data.get('setor', user.setor)
        user.ramal = data.get('ramal', user.ramal)
        user.save()
        
        serializer = UserSerializer(user)
        return Response(serializer.data)

class AlterarSenhaView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not user.check_password(old_password):
            return Response({'error': 'Senha atual incorreta'}, status=400)
        
        if len(new_password) < 6:
            return Response({'error': 'Nova senha deve ter pelo menos 6 caracteres'}, status=400)
        
        user.set_password(new_password)
        user.save()
        
        return Response({'message': 'Senha alterada com sucesso'})

class MeusEquipamentosView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        equipamentos = user.equipamentos.all()
        from equipamentos.serializers import EquipamentoSerializer
        serializer = EquipamentoSerializer(equipamentos, many=True)
        return Response(serializer.data)
