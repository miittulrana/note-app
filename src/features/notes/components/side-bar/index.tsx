import { Logo } from '../../../common/components/logo';
import { FolderList } from '../folder-list';

export function SideBar() {
  return (
    <section className="py-8 px-4 sm:p-8 flex flex-col border-r-2 border-gray-100 w-64">
      <Logo />

      <div className="mt-10">
        <FolderList />
      </div>
    </section>
  );
}