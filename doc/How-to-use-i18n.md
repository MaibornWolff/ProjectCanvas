How to use the Multi-Language Support

We are using the i18next framework for the implementation of the language selection in our app.

The i18n.ts file
In this file we define all the different languages which we are supporting.

The i18next.d.ts file
This file is used for type definiton.

Json files
Each page has its own translation file in englisch and german.
Structure of the Json file:

{
"nameOfString": "The String"
}

If a new String is added to the translation, the String needs to be added in each Language Json file

If the new sting is used in a Button, please add it to the button object:
{
"button" : {
"goBack": "Go Back"
}
}

If a new Page is added two new Json File needs to be added. One for the egnlisch translation and one for the german translation.
Also the namespace of the new Json Fiels needs to be added to the i18n.ts adn the i18next.d.ts file.

I created the LanguageSelection.tsx file, which provides a DropDown Menu for the language selection. The file can be imported and the <LanguageSelection /> can be used to place the DropDown Menu.

Add Multilanguage support to Component
Import:
import { useTranslation } from "react-i18next"

Add constant:
const { t } = useTranslation("login")

Add DropDown at the desired spot:
<LanguageSelector />
Access the language string
label={t("choseProvider")}
