// Página de Perfil

export function UserProfile({ name, avatarUrl }) {
  return (
    <div className="u-profile">
      <img className="u-avatar" alt={name} src={avatarUrl} />
      <strong className="u-username">{name}</strong>
    </div>
  );
}
