import { Image } from "react-bootstrap";

function ProfileCover() {
  // https://www.template.net/design-templates/backgrounds/facebook-cover-backgrounds/
  return (
    <Image
      src={process.env.PUBLIC_URL + "imgs/Natural-Facebook-Cover-Photo.jpg"}
      alt="Cover logo"
      fluid
    />
  );
}

export default ProfileCover;
