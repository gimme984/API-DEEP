from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioView, UsuarioViewSet, TecnicosListView, RegistroView, EsqueciSenhaView, ResetarSenhaView, AtualizarPerfilView, AlterarSenhaView, MeusEquipamentosView

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('usuario/', UsuarioView.as_view(), name='usuario'),
    path('usuarios/tecnicos/', TecnicosListView.as_view(), name='tecnicos'),
    path('registro/', RegistroView.as_view(), name='registro'),
    path('esqueci-senha/', EsqueciSenhaView.as_view(), name='esqueci_senha'),
    path('resetar-senha/<str:token>/', ResetarSenhaView.as_view(), name='resetar_senha'),
    path('perfil/', AtualizarPerfilView.as_view(), name='perfil'),
    path('alterar-senha/', AlterarSenhaView.as_view(), name='alterar_senha'),
    path('meus-equipamentos/', MeusEquipamentosView.as_view(), name='meus_equipamentos'),
]
